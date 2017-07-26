import fetch from 'utils/fetch';

import { service } from 'utils/fetchUtil';

const module = 'sysUser';

export function loginByEmail(email, password) {
  const data = {
    email,
    password
  };
  return fetch({
    url: '/login/loginbyemail',
    method: 'post',
    data
  });
}

export function logout() {
  // return fetch({
  //   url: '/login/logout',
  //   method: 'post'
  // });
  return service('', 'loginOut', '', 'post');
}



/* export function loginByName(userName, userPassword) {
  var query = {
    userName: userName,
    userPassword: userPassword,
    page: 1,
    limit : 1
  };
  return service(module, "query", query);
}*/
export function loginByName(userName, userPassword) {
  const query = {
    userName,
    userPassword
  };
  return service('', 'login', query, 'post');
}

export function getUserList(query) {
  return service(module, 'query', query);
}

// 需要带查询条件，匹配spring注解@RequestBody
// 内容可以空
export function getInfo() {
  const query = {
    userId: ''
  }
  return service(module, 'info', query);
}

export function addSystemUser(query) {
  return service(module, 'add', query);
}

export function deleteSystemUser(query) {
  return service(module, 'delete', query);
}

export function updateSystemUser(query) {
  return service(module, 'update', query);
}


/* export function loginByName(userName, userPassword) {
  const data = {
    userName,
    userPassword
  };
  // var url = '/api/sysUser/getAll/0/1';
  var url = 'http://localhost:8088/api/sysUser/getAll/0/1';
  return fetch({
    url: url,
    method: 'post',
    data
  });
}


export function getUserList(query) {
  var page, limit,
      // url = '/api/sysUser/getAll';
      url = 'http://localhost:8088/api/sysUser/getAll';
  if(query){
    page = +query.page - 1;
    limit = query.limit;
  }
  if(page != null && limit != null){
    url += "/" + page + "/" + limit;
  }

  return fetch({
    url: url,
    method: 'post',
    data: query
  });
}


export function getInfo(userId) {
  // var url = '/api/sysUser/get';
  var url = 'http://localhost:8088/api/sysUser/get';
  return fetch({
    url: url,
    method: 'post',
    data:{
      userId : userId
    }
  });
}


export function addSystemUser(query) {
  var url = 'http://localhost:8088/api/sysUser/add';
      // url = '/api/sysUser/add';

  return fetch({
    url:url,
    method: 'post',
    data: query
  });
}

export function deleteSystemUser(userId) {
  var url = 'http://localhost:8088/api/sysUser/delete';
      // url = '/api/sysUser/delete';

  return fetch({
    url:url + "/" + userId,
    method: 'delete'
  });
}

export function updateSystemUser(query) {
  var url = 'http://localhost:8088/api/sysUser/update';
      // url = '/api/sysUser/update';

  return fetch({
    url:url,
    method: 'put',
    data: query
  });
}*/

