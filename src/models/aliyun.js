import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import pathToRegexp from 'path-to-regexp'
import { iotxAccountListAttr, productInfoListGet, queryPropertyByProductKey } from '../services/aliyun';
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
  },
  effects: {
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

      const data = yield call(queryPropertyByProductKey, payload)

      if (data && data.code === 200) {
        yield put({
          type: 'updateState',
          payload: {
            productDetail: data.data,
          },
        })
      } else {
        debug('error data=%o', data)
        console.error('error data=', data)
        throw data
      }
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
  },
  subscriptions: {

    setupProductDetail({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/aliyun/ProductDetail/:ProductKey').exec(pathname)
        if (match) {
          dispatch({
            type: 'fetchProductByProductKey',
            payload: match[1],
          })
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
