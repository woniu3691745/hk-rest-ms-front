// import fetch from 'utils/fetch';
import { service } from 'utils/fetchUtil';

const module = 'menu';

export function getAllMenus(query) {
  return service(module, 'get', query, 'post');
}

export function getMenusByPage(query) {
  return service(module, 'query', query);
}

export function addMenu(query) {
  return service(module, 'add', query);
}

export function deleteMenu(query) {
  return service(module, 'delete', query);
}

export function updateMenu(query) {
  return service(module, 'update', query);
}