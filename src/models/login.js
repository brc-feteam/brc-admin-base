import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeAccountLogin, fakeAccountLogin2 } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import config from '../components/Exception/typeConfig';

function loopTreeData(data, pid) {
  let result = [], temp;
  for (let i = 0; i < data.length; i++) {
    if (data[i].pmenuId === pid) {
      const obj = {
        "id": data[i].menuId,
        "pid": data[i].pmenuId,
        "title": data[i].name,
        "key": data[i].menuKey,
        "tag": data[i].tag,
        "to": data[i].tourl,
      };
      temp = loopTreeData(data, data[i].menuId);
      if (temp != undefined) {
        if (temp.length > 0) {
          obj.subs = temp;
        } else {
          obj.subs = [];
        }
      } else {
        obj.subs = [];
      }
      result.push(obj);
    }
  }
  return result;
}

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully - API3
      if (response.success) {
        reloadAuthorized();

        const rs = response.data;
        sessionStorage.setItem('login', 'true');
        sessionStorage.setItem('name', rs.name);
        sessionStorage.setItem('token', rs.token);
        const menus = loopTreeData(rs.menus, -1);
        const str = JSON.stringify(menus);
        sessionStorage.setItem('menus', str);

        yield put(routerRedux.push('/'));
      } else {
        message.info("用户密码错误");
      }
      // Login successfully - API1
      // if (response.status === 'ok') {  
      //   reloadAuthorized();
      //   yield put(routerRedux.push('/'));
      // }
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
