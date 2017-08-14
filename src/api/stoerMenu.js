// import fetch from 'utils/fetch';
import { service } from 'utils/fetchUtil';

const module = 'menu';

export function getAllStoreMenus(query) {
  return service(module, 'get', query, 'post');
}

export function getStoresByPage(query) {
  return service(module, 'query', query);
}

export function addStore(query) {
  return service(module, 'add', query);
}

export function deleteStore(query) {
  return service(module, 'delete', query);
}

export function updateStore(query) {
  return service(module, 'update', query);
}

// 通过当前门店ID获得门店图片
export function getStoreImages(query) {
  return service('store', 'storeImgDowns', query, 'post');
}

// 通过文件名字删除文件
export function delStoreImages(query) {
  const query1 = {
    imgUrl: query
  }
  return service(module, 'delStoreImg', query, 'delete');
}