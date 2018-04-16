import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { iotxAccountListAttr, productInfoListGet } from '../services/aliyun';
import base from './common/base'

const debug = require('debug')('brc-models[aliyun]');

export default modelExtend(base.pageModel, {
  namespace: "aliyun",
  state: {
    productInfoList: [],
    productStatus: 'DEVELOPMENT_STATUS', // RELEASE_STATUS
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

      console.log(payload)
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
    // save(state, action) {
    //   return {
    //     ...state,
    //   };
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
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

          // queryString.stringify()

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
