import fetch from 'utils/fetch';


let servicePro = '',
  acrionMap = {
    all: ['getAll', 'post'],
    query: ['getAll', 'post'],
    add: ['add', 'post'],
    delete: ['delete', 'delete'],
    update: ['update', 'put'],
    info: ['get', 'post']
  };
if (process.env.NODE_ENV === 'development') {
  // servicePro = 'http://10.7.13.152:8088';
}

/**
 *
 * @param {string} module 模块
 * @param {string} action 增删改查的操作（all,query,add,delete,update）
 * @param {object} data 请求需要传递的数据
 * @param {string} method 请求的方法（get,post,put,delete），不传该值取acrionMap默认值
 */
export function service(module, action, data, method) {
  let url = '/api/' + (module ? module + '/' : '');
  if (acrionMap[action]) {
    url += acrionMap[action][0];
    if (action === 'query') {
      const page = +data.page;
      const limit = data.limit;
      url += '/' + page + '/' + limit;
    } else if (action === 'delete') {
      url += '/' + data;
    }
  } else {
    url += action
  }
  return fetch({
    url,
    method: method || acrionMap[action][1],
    data
  });
}