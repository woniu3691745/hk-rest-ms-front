<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleCreate()">添加</el-button>
      <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleCreate()">批量添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column width="263px" align="center" label="菜名">
        <template scope="scope">
          <span>{{scope.row.dishesName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="价格">
        <template scope="scope">
          <span>{{scope.row.dishesPrice}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="折扣">
        <template scope="scope">
          <span>{{scope.row.dishesDiscountPrice}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="270">
        <template scope="scope">
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button  size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" ref="userForm" :rules="menuRules" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="菜名" prop="dishesName">
          <el-input v-model="temp.dishesName" name = "dishesName"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="dishesPrice">
          <el-input v-model="temp.dishesPrice" name = "dishesPrice"></el-input>
        </el-form-item>

        <el-form-item label="折扣" prop="dishesDiscountPrice">
          <el-input v-model="temp.dishesDiscountPrice" name = "dishesDiscountPrice"></el-input>
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
    import { getTablesByPage, addTable, deleteTable, updateTable } from 'api/storeTable';
    import { parseTime } from 'utils';

    import store from 'store';

    export default {
      name: 'table_demo',
      data() {
        const storeId = this.$route.params.storeId || store.getters.storeId;
        var roles = store.getters.roles;
        return {
          addBtnRole:roles.indexOf("boss")>-1,
          storeId:storeId,
          list: null,
          total: null,
          listLoading: false,
          listQuery: {
            page: 1,
            limit: 20,
            storeId: storeId
          },
          temp: {
            dishesName: undefined,
            dishesPrice: undefined,
            dishesDiscountPrice: undefined
          },
          menuRules: {
            dishesName: [
                { required: true, trigger: 'blur'}
            ],
            dishesPrice: [
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
        //this.getList();
      },
      methods: {
        getList() {
          this.listLoading = true;
          getTablesByPage(this.listQuery).then(response => {
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
            dishesName: undefined,
            dishesPrice: undefined,
            dishesDiscountPrice: undefined
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
