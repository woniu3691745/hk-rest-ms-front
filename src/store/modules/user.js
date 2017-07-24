import { loginByEmail, loginByName, logout, getInfo } from 'api/login';
import { fetchSystemMenuList } from 'api/menu';
import Cookies from 'js-cookie';

const _import = require('../../router/_import_' + process.env.NODE_ENV);

const user = {
  state: {
    user: '',
    status: '',
    email: '',
    code: '',
    uid: undefined,
    auth_type: '',
    token: Cookies.get('Admin-Token'),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_AUTH_TYPE: (state, type) => {
      state.auth_type = type;
    },
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_EMAIL: (state, email) => {
      state.email = email;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    // 邮箱登录
    LoginByEmail({ commit }, userInfo) {
      const email = userInfo.email.trim();
      return new Promise((resolve, reject) => {
        loginByEmail(email, userInfo.password).then(response => {
          const data = response.data;
          Cookies.set('Admin-Token', response.data.token);
          commit('SET_TOKEN', data.token);
          commit('SET_NAME', name);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 用户名登录
    LoginByName({ commit }, userInfo) {
      const name = userInfo.name.trim();
      return new Promise((resolve, reject) => {
        loginByName(name, userInfo.password).then(response => {
          const data = response.data[0];
          if(data[0]){
            var userData = data[0];
            Cookies.set('Admin-Token', userData.userId);
            commit('SET_TOKEN', userData.userId);
            commit('SET_NAME', userData.userName);
          }
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const userData = response.data[0];
          commit('SET_TOKEN', userData.userId);
          commit('SET_NAME', userData.userName);
          commit('SET_ROLES', userData.userRole.split(","));
          commit('SET_UID', userData.userId);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
          commit('SET_TOKEN', response.data.token);
          Cookies.set('Admin-Token', response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          Cookies.remove('Admin-Token');
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_ROLES', [role]);
        commit('SET_TOKEN', role);
        Cookies.set('Admin-Token', role);
        resolve();
      })
    },

    // 获取菜单数据
    GetMenuList({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetchSystemMenuList(state.auth_type).then(response => {
          const data = response.data;
          initMenu(data);
          // initMenu(data.items);
          //asyncRouterMap = data.items;
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};


function initMenu(menuList){
  var length = menuList.length;
   for(var i = 0; i < length; i++){
     var menu = menuList[i],
         component = menu.component;
     if(component){
       try {
         component = _import(component);
         menu.component = component;
       } catch (error) {
         menu.component = null;
       }
       if(!menu.parent && menu.path.indexOf("/") != 0){
         menu.path = "/" + menu.path;
       }
       if(menu.children){
         initMenu(menu.children);
       }
     }
   }
}

export default user;
