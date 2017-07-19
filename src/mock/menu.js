import Mock from 'mockjs';
import { param2Obj } from 'utils';

const List = [{
  path: '/permission',
  component: "layout/Layout",
  redirect: '/permission/index',
  name: '权限测试',
  icon: 'quanxian',
  meta: { role: ['admin'] },
  noDropdown: true,
  children: [{ path: 'index', component: "permission/index", name: '权限测试页', meta: { role: ['admin'] } }]
},{
  path: '/user',
  component: "layout/Layout",
  redirect: '/user/index',
  name: '用户管理',
  icon: 'quanxian',
  meta: { role: ['admin'] },
  noDropdown: true,
  children: [{ path: 'index', component: "user/index", name: '用户管理页', meta: { role: ['admin'] } }]
},{
  path: '/components',
  component: "layout/Layout",
  redirect: '/components/index',
  name: '组件',
  icon: 'zujian',
  children: [
    { path: 'index', component: "components/index", name: '介绍 ' },
    { path: 'tinymce', component: "components/tinymce", name: '富文本编辑器' },
    { path: 'markdown', component: "components/markdown", name: 'Markdown' },
    { path: 'jsoneditor', component: "components/jsoneditor", name: 'JSON编辑器' },
    { path: 'dndlist', component: "components/dndlist", name: '列表拖拽' },
    { path: 'splitpane', component: "components/splitpane", name: 'SplitPane' },
    { path: 'avatarupload', component: "components/avatarUpload", name: '头像上传' },
    { path: 'dropzone', component: "components/dropzone", name: 'Dropzone' },
    { path: 'sticky', component: "components/sticky", name: 'Sticky' },
    { path: 'countto', component: "components/countTo", name: 'CountTo' },
    { path: 'mixin', component: "components/mixin", name: '小组件' }
  ]
},{
  path: '/example',
  component: "layout/Layout",
  redirect: 'noredirect',
  name: '综合实例',
  icon: 'zonghe',
  children: [
    {
      path: '/example/table',
      component: "example/table/index",
      redirect: '/example/table/table',
      name: 'Table',
      children: [
        { path: 'dynamictable', component: "example/table/dynamictable", name: '动态table' },
        { path: 'dragtable', component: "example/table/dragTable", name: '拖拽table' },
        { path: 'inline_edit_table', component: "example/table/inlineEditTable", name: 'table内编辑' },
        { path: 'table', component: "example/table/table", name: '综合table' }
      ]
    },
    { path: 'form/edit', component: "example/form", name: '编辑Form', meta: { isEdit: true } },
    { path: 'form/create', component: "example/form", name: '创建Form' },

    { path: 'tab/index', component: "example/tab/index", name: 'Tab' }
  ]
}];

export default {
  getMenuList: config => {
    return {
      items: List
    }
  }
};
