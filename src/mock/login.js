import { param2Obj } from 'utils';

const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin',
    password:"123456",
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '超级管理员小潘',
    uid: '001'
  },
  editor: {
    role: ['editor'],
    token: 'editor',
    password:"123456",
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '普通编辑小张',
    uid: '002'

  },
  developer: {
    role: ['develop'],
    token: 'develop',
    password:"123456",
    introduction: '我是开发',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '工程师小王',
    uid: '003'
  }
}

export default {
  loginByEmail: config => {
    const { email } = JSON.parse(config.body);
    return userMap[email.split('@')[0]];
  },
  loginByName: config => {
    const { name,password } = JSON.parse(config.body);
    var user = userMap[name];
    if(user.password === password){
      return user
    }
    return null;
  },
  getUserList: config => {
    const { token, page, limit, sort } = param2Obj(config.url);
    var items = [];
    for(var user in userMap){
      if(!token || user.indexOf(token) > -1){
        items.push(userMap[user]);
      }
    }
    return {
      items : items,
      total: 1
    };
  },
  getInfo: config => {
    const { token } = param2Obj(config.url);
    if (userMap[token]) {
      return userMap[token];
    } else {
      return Promise.reject('a');
    }
  },
  logout: () => 'success'
};
