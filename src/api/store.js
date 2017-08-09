// import fetch from 'utils/fetch';
import { service } from 'utils/fetchUtil';

const module = 'store';

export function getAllStores(query) {
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

export function getStoreImages(query) {
  return service('store', 'storeImgDowns', query, 'get');
}