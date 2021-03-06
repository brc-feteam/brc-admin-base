import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeAccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
// import config from '../components/Exception/typeConfig';
const debug = require('debug')('brc-utils[request]');

// function loopTreeData(data, pid) {
//   let result = [], temp; // eslint-disable-line
//   for (let i = 0; i < data.length; i += 1) {
//     if (data[i].pmenuId === pid) {
//       const obj = {
//         id: data[i].menuId,
//         pid: data[i].pmenuId,
//         title: data[i].name,
//         key: data[i].menuKey,
//         tag: data[i].tag,
//         to: data[i].tourl,
//       };
//       temp = loopTreeData(data, data[i].menuId);
//       if (temp != undefined) { // eslint-disable-line
//         if (temp.length > 0) {
//           obj.subs = temp;
//         } else {
//           obj.subs = [];
//         }
//       } else {
//         obj.subs = [];
//       }
//       result.push(obj);
//     }
//   }
//   return result;
// }

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      debug('test debug');

      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully - API3
      // if (response.success) {
      //   reloadAuthorized();

      //   const rs = response.data;
      //   sessionStorage.setItem('login', 'true');
      //   sessionStorage.setItem('name', rs.name);
      //   sessionStorage.setItem('token', rs.token);
      //   const menus = loopTreeData(rs.menus, -1);
      //   const str = JSON.stringify(menus);
      //   sessionStorage.setItem('menus', str);

      //   yield put(routerRedux.push('/'));
      // } else {
      //   message.info('用户密码错误');
      // }

      // Login successfully - API1
      if (response.status === 'ok') {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      } else {
        message.error('登录失败');
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
