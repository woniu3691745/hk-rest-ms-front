<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <router-link to="/store/storeInfo">
        <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit">添加</el-button>
      </router-link>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column width="263px" align="center" label="店名">
        <template scope="scope">
          <span>{{scope.row.storeName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="店主">
        <template scope="scope">
          <span>{{scope.row.storeAdmin}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="餐位费">
        <template scope="scope">
          <span>{{scope.row.seatCost}}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="服务费">
        <template scope="scope">
          <span>{{scope.row.serviceCost}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="电话">
        <template scope="scope">
          <span>{{scope.row.storePhone}}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="营业时间">
        <template scope="scope">
          <span>{{scope.row.storeBusinessDay || "全年"}}</span><br>
          <span>上午：{{scope.row.storeBusinessAmStartHours}} - {{scope.row.storeBusinessAmEndHours}}</span><br>
          <span>下午：{{scope.row.storeBusinessPmStartHours}} - {{scope.row.storeBusinessPmEndHours}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="270">
        <template scope="scope">
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">餐桌</el-button>
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">菜品</el-button>
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

  </div>
</template>

<script>
    import { getStoresByPage, addStore, deleteStore, updateStore } from 'api/store';
    import { parseTime } from 'utils';

    import store from 'store';

    export default {
      name: 'table_demo',
      data() {
        var roles = store.getters.roles;
        return {
          addBtnRole:roles.indexOf("boss")>-1,
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            userId: store.getters.uid
          },
          temp: {
            name: undefined,
            path: undefined,
            component: undefined,
            role: undefined,
            parent: undefined,
            redirect: undefined,
            icon: undefined
          },
          menuRules: {
            name: [
                { required: true, trigger: 'blur'}
            ],
            path: [
                { required: true, trigger: 'blur'}
            ],
            component: [
                { required: true, trigger: 'blur'}
            ],
            role: [
                { required: true, trigger: 'blur'}
            ]
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
          getStoresByPage(this.listQuery).then(response => {
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
        handleCreate() {
          debugger;
          this.dialogFormVisible = true;
        },
        handleUpdate(row) {
          this.$router.push({
            path:'/store/storeInfo/' +　row.storeId
          });
        },
        handleDelete(row) {
          deleteStore(row.storeId).then(() => {
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
