import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import { accountatt } from '../services/aliyun';
import base from './common/base'

// export default modelExtend(base.pageModel, {
//   namespace: 'aliyun',

//   state: {
//     list: [],
//     pagination: 10,
//   },

//   reducers: {
//   },

//   effects: {
//     *fetch({ payload }, { call, put }) {
//       // todo
//     },
//   },
// })

export default modelExtend(base.pageModel, {
  namespace: "aliyun",
  // state: {
  // },
  effects: {
    *fetch({ payload }, { call, put }) {

      const data = yield call(accountatt, payload);
      if (data && data.success) {
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
        throw data
      }
    },
  },
  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //   };
    // },
  },
  subscriptions: {
    setup({ dispatch, history}){
      history.listen((location)=>{
        if(location.pathname === '/aliyun/accountatt') {
          dispatch({
            type: 'fetch',
            payload:{
              status:2,
              ...queryString.parse(location.search),
            },
          })
        }
      })
    },
  },
});
