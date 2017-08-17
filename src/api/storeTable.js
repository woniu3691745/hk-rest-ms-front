// import fetch from 'utils/fetch';
import { service } from 'utils/fetchUtil';

const module = 'table';

export function getAllTables(query) {
  return service(module, 'get', query, 'post');
}

export function getTablesByPage(query) {
  return service(module, 'query', query);
}

export function addTable(query) {
  return service(module, 'add', query);
}

export function deleteTable(query) {
  return service(module, 'delete/'+query, query, 'delete');
}

export function updateTable(query) {
  return service(module, 'update', query);
}

export function makeQRCodeImg(query, storeId) {
  return service(module, storeId +'/makeQRCodeImg', query, "post");
}

export function downLoadQRCodeZip(storeId) {
  return service(module, storeId +'/downLoadQRCodeZip', null, "get");
}