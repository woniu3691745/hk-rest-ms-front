<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column width="83px" align="center" label="菜单ID">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="110px" align="center" label="菜单名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="页面路径">
        <template scope="scope">
          <span>{{scope.row.path}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="组件路径">
        <template scope="scope">
          <span>{{scope.row.component}}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="菜单权限">
        <template scope="scope">
          <span>{{scope.row.role}}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="父菜单">
        <template scope="scope">
          <span>{{scope.row.parent}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="系统菜单">
        <template scope="scope">
          <span>{{menuTypeOptionsObj[scope.row.type]}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="图片（一级）">
        <template scope="scope">
          <span>{{scope.row.icon}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" ref="menuForm" :rules="menuRules" :model="temp" label-position="left" label-width="150px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="temp.name" name = "name"></el-input>
        </el-form-item>

        <el-form-item label="页面路径" prop="path">
          <el-input v-model="temp.path" name = "path"></el-input>
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input v-model="temp.component" name = "component"></el-input>
        </el-form-item>

        <el-form-item label="菜单权限" prop="role">
          <el-input v-model="temp.role" name = "role"></el-input>
        </el-form-item>

        <el-form-item label="父菜单">
          <el-input v-model="temp.parent"></el-input>
        </el-form-item>

        <el-form-item label="是否是系统菜单">
          <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
            <el-option v-for="item in menuTypeOptions" :key="item" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="默认路径（一级）">
          <el-input v-model="temp.redirect"></el-input>
        </el-form-item>

        <el-form-item label="图片（一级）">
          <el-input v-model="temp.icon"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import { fetchSystemMenusByPage, addSystemMenu, deleteSystemMenu, updateSystemMenu } from 'api/menu';
    import { parseTime } from 'utils';

    import store from 'store';

    export default {
      name: 'table_demo',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            name: undefined
          },
          temp: {
            name: undefined,
            path: undefined,
            component: undefined,
            role: undefined,
            parent: undefined,
            redirect: undefined,
            type: 1,
            icon: undefined
          },
          menuRules: {
            name: [
                { required: true, trigger: 'blur', message: '菜单名称不能为空'}
            ],
            path: [
                { required: true, trigger: 'blur', message: '页面路径不能为空'}
            ],
            component: [
                { required: true, trigger: 'blur', message: '组件路径不能为空'}
            ],
            role: [
                { required: true, trigger: 'blur', message: '菜单权限不能为空'}
            ]
          },
          menuTypeOptions: [
            {
              name: '是',
              value: 1
            },
            {
              name: '否',
              value: 0
            }
          ],
          menuTypeOptionsObj: {
            "1":"是",
            "0":"否"
          },
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          tableKey: 0
        }
      },
      created() {
        this.getList();
      },
      methods: {
        getList() {
          this.listLoading = true;
          fetchSystemMenusByPage(this.listQuery).then(response => {
            this.list = response.data[0];
            this.total = response.data[1];
            this.listLoading = false;
          })
        },
        handleFilter() {
          this.getList();
        },
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
        handleModifyStatus(row, status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          row.status = status;
        },
        handleCreate() {
          this.resetTemp();
          this.dialogStatus = 'create';
          this.dialogFormVisible = true;
        },
        handleUpdate(row) {
          this.temp = Object.assign({}, row);
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        },
        handleDelete(row) {
          deleteSystemMenu(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          })
        },
        create() {
          this.$refs.menuForm.validate(valid => {
            if (valid) {
              this.temp.creater = store.getters.name;
              this.temp.modify = store.getters.name;
              addSystemMenu(this.temp).then(response => {
                this.temp = response.data[0];
                this.list.unshift(this.temp);
                this.dialogFormVisible = false;
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        update() {
          this.$refs.menuForm.validate(valid => {
            if (valid) {
              this.temp.modify = store.getters.name;
              updateSystemMenu(this.temp).then(() => {
                for (const v of this.list) {
                  if (v.id === this.temp.id) {
                    const index = this.list.indexOf(v);
                    this.list.splice(index, 1, this.temp);
                    break;
                  }
                }
                this.dialogFormVisible = false;
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetTemp() {
          this.temp = {
            name: undefined,
            path: undefined,
            type:1,
            component: undefined,
            role: undefined,
            parent: undefined,
            redirect: undefined,
            icon: undefined
          };
        },
        handleDownload() {
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel');
            const tHeader = ['菜单名称', '页面路径', '组件路径', '菜单权限', '父菜单', '默认路径（一级）', '图片（一级）'];
            const filterVal = ['name', 'path', 'component', 'role', 'parent', 'redirect', 'icon'];
            const data = this.formatJson(filterVal, this.list);
            export_json_to_excel(tHeader, data, 'table数据');
          })
        },
        formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
            if (j === 'timestamp') {
              return parseTime(v[j])
            } else {
              return v[j]
            }
          }))
        }
      }
    }
</script>
