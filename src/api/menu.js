//import fetch from 'utils/fetch';
import {service} from 'utils/fetchUtil';

var module = "sysMenu";

export function fetchSystemMenuList(query) {
  return service(module, "all", query, "get");
}

export function fetchSystemMenusByPage(query) {
  return service(module, "query", query);
}

export function addSystemMenu(query) {
  return service(module, "add", query);
}

export function deleteSystemMenu(query) {
  return service(module, "delete", query);
}

export function updateSystemMenu(query) {
  return service(module, "update", query);
}
/*export function fetchSystemMenuList(query) {
  var page, limit,
      // url = '/api/sysMenu/getAll';      
      url = 'http://localhost:8088/api/sysMenu/getAll';
  return fetch({
    url:url,
    method: 'get',
    params: query
  });
}


export function fetchSystemMenusByPage(query) {
  var page, limit,
      // url = '/api/sysMenu/getAll';      
      url = 'http://localhost:8088/api/sysMenu/getAll';
  if(query){
    page = +query.page - 1;
    limit = query.limit;
  }
  if(page != null && limit != null){
    url += "/" + page + "/" + limit;
  }
  return fetch({
    url:url,
    method: 'post',
    data: query
  });
}

export function addSystemMenu(query) {
  var url = 'http://localhost:8088/api/sysMenu/add';
      // url = '/api/sysMenu/add';      
      
  return fetch({
    url:url,
    method: 'post',
    data: query
  });
}

export function deleteSystemMenu(menuId) {
  var url = 'http://localhost:8088/api/sysMenu/delete';
      // url = '/api/sysMenu/add';      
      
  return fetch({
    url:url + "/" + menuId,
    method: 'delete'
  });
}

export function updateSystemMenu(query) {
  var url = 'http://localhost:8088/api/sysMenu/update';
      // url = '/api/sysMenu/update';      
      
  return fetch({
    url:url,
    method: 'put',
    data: query
  });
}*/