import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import pathToRegexp from 'path-to-regexp'
import { iotxAccountListAttr, productInfoListGet, queryPropertyByProductKey, setThingProperties, getThingProperty, queryDeviceByProductKey } from '../services/aliyun';
import base from './common/base'
// import { stat } from 'fs';

const debug = require('debug')('brc-models[aliyun]');

export default modelExtend(base.pageModel, {
  namespace: "aliyun",
  state: {
    productInfoList: [],
    productStatus: 'DEVELOPMENT_STATUS', // RELEASE_STATUS
    productNodeType: "DEVICE",
    locationPathname: '',
    locationQuery: {},
    productDetail: {},
    deviceState: true,
    deviceList: [],
    SelectedDevice: {},
  },
  effects: {
    /*
    CRUD:  fetch,put,remove,new
    */
    *fetchIotxAccountListAttr({ payload }, { call, put }) {
      const data = yield call(iotxAccountListAttr, payload);
      if (data && data.code === 200) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total || data.data.length,
            },
          },
        })
      } else {
        debug('error data=%o', data)
        console.error('error data=', data)
        throw data
      }
    },

    *fetchProductInfoListGet({ payload }, { call, put }) {
      console.info('fetchProductInfoListGet', payload)

      yield put({
        type: 'updateState',
        payload: {
          productStatus: payload.status,
          productNodeType: payload.nodeType,
        },
      })

      const data = yield call(productInfoListGet, payload);

      if (data && data.code === 200) {
        yield put({
          type: 'queryProductSuccess',
          payload: {
            productInfoList: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total || data.data.length,
            },
          },
        })
      } else {
        debug('error data=%o', data)
        console.error('error data=', data)
        throw data
      }
    },

    *fetchProductByProductKey({ payload }, { call, put }) {

      const { productKey, page, pageSize } = payload
      const data = yield call(queryPropertyByProductKey, productKey)

      if (data && data.code === 200) {
        yield put({
          type: 'updateState',
          payload: {
            productDetail: data.data,
          },
        })

        yield put({
          type: 'fetchDeviceByProductKey',
          payload: { productKey, page, pageSize },
        })

      } else {
        debug('error data=%o', data)
        console.error('error data=', data)
        throw data
      }
    },

    *fetchDeviceByProductKey({ payload }, { call, put }) {
      const { productKey, page, pageSize } = payload
      const data = yield call(queryDeviceByProductKey, {
        productKey,
        page,
        pageSize,
      });
      if (data && data.code === 200) {

        const result = data.data

        yield put({
          type: 'updateState',
          payload: {
            deviceList: result.items,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: result.totalNum || result.items.length,
            },
          },
        })
      } else {
        debug('error data=%o', data)
        console.error('error data=', data)
        throw data
      }
    },

    *putThingProperties({ payload }, { call, put, ...rest }) {
      console.log('model effets putThingProperties ', payload, rest)
      const {SelectedDevice, productDetail, ...restpayload} = payload 
      
      const data = yield call(setThingProperties, restpayload);

      if (data && data.code === 200) {
        yield put({
          type: 'updateState',
          payload: {
            deviceState: data.data,
          },
        })

        yield put({
          type: 'fetchThingProperty',
          payload: {
            SelectedDevice, 
            productDetail,
          },
        })

      } else {
        // debug('error data=%o', data)
        // console.error('error data=', data)
        throw data
      }
    },

    *fetchThingProperty({ payload }, { call, put }) {
      const { SelectedDevice, productDetail } = payload
      const statusProperty = [];
      for (let i = 0; i < productDetail.length; i += 1) {
        const o = productDetail[i];
        const data = yield call(getThingProperty, {
          productKey: SelectedDevice.productKey,
          deviceName: SelectedDevice.name,
          propertyIdentifier: o.identifier,
        });
        if (data && data.code === 200) {
          statusProperty.push(data.data)
        }
      }

      yield put({
        type: 'handleSelectDevice',
        payload: SelectedDevice,
      })

      yield put({
        type: 'patchDeviceStatus',
        payload: statusProperty,
      })

    },
  },
  reducers: {
    queryProductSuccess(state, { payload }) {
      const { productInfoList, pagination } = payload
      return {
        ...state,
        productInfoList,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
    handleProductStatus(state, { payload }) {
      return {
        ...state,
        productStatus: payload,
      }
    },
    handleSelectDevice(state, { payload }) {
      return {
        ...state,
        SelectedDevice: payload,
      }
    },
    patchDeviceStatus(state, { payload: statusProperty }) {
      const { productDetail } = state;
      const newList = [];
      productDetail.forEach(r => {
        const item = statusProperty.find(o => { return o.attribute === r.identifier })
        newList.push(Object.assign({}, r, item))
      });
      return {
        ...state,
        productDetail: newList,
      }
    },
  },
  subscriptions: {

    setupProductDetail({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/aliyun/ProductDetail/:ProductKey').exec(pathname)
        if (match) {
          dispatch({
            type: 'fetchProductByProductKey',
            payload: {
              productKey: match[1],
              ...queryString.parse(location.search),
            },
          })
        } else {
          console.error('page error, no productKey')
        }
      })
    },

    // test new subscription
    setupHistory({ dispatch, history }) {
      console.log('subscriptions - setupHistory')

      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup({ dispatch, history }) {
      console.log('subscriptions - aliyun - setup')

      history.listen((location) => {
        if (location.pathname === '/aliyun/accountatt') {
          dispatch({
            type: 'fetchIotxAccountListAttr',
            payload: {
              status: 2,
              ...queryString.parse(location.search),
            },
          })
        } else if (location.pathname === '/aliyun/productlist') {

          const defaultProps = {
            "pageNo": 1,
            "pageSize": 10,
            "status": "DEVELOPMENT_STATUS",
            "nodeType": "DEVICE",
          }

          dispatch({
            type: 'fetchProductInfoListGet',
            payload: {
              ...defaultProps,
              ...queryString.parse(location.search),
            },
          })
        }
      })
    },
  },
});
