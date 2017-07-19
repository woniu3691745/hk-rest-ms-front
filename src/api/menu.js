import fetch from 'utils/fetch';


export function fetchSystemMenuList(query) {
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
}