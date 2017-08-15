<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名" v-model="listQuery.token">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column width="130px" align="center" label="用户名">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="管理门店名">
        <template scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="用户角色">
        <template scope="scope">
          <span>{{scope.row.userRole}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="联系方式">
        <template scope="scope">
          <span>{{scope.row.userPhone}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="创建人">
        <template scope="scope">
          <span>{{scope.row.creater}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createDateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300px">
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
      <el-form class="small-space" ref="userForm" :rules="userRules" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" name = "userName"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="temp.userPassword" name = "userPassword"></el-input>
        </el-form-item>

        <el-form-item label="管理门店" v-if="storeRole">
          <el-select class="filter-item" v-model="temp.storeId" placeholder="请选择">
            <el-option v-for="item in  storeOptions" :key="item" :label="item.storeName" :value="item.storeId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系方式">
          <el-input v-model="temp.userPhone"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-select class="filter-item" v-model="temp.userSex" placeholder="请选择">
            <el-option v-for="item in  sexOptions" :key="item" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地址">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.userAddress">
          </el-input>
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
    import { getUserList, addSystemUser, deleteSystemUser,updateSystemUser } from 'api/login';
    import { getAllStores} from 'api/store';
    import { parseTime } from 'utils';

    import store from 'store';

    export default {
      name: 'table_demo',
      data() {
        var roles = store.getters.roles;
        return {
          storeRole:roles.indexOf("boss")>-1,
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 20,
            userName: undefined
          },
          temp: {
            userName: undefined,
            userPassword: undefined,
            userPhone: undefined,
            userSex: undefined,
            userAddress: undefined,
            createDateTime: undefined,
            storeId:undefined,
            creater: undefined
          },
          userRules: {
            userName: [
                { required: true, trigger: 'blur', message: '用户名不能为空'}
            ],
            userPassword: [
                { required: true, trigger: 'blur', message: '密码不能为空'}
            ]
          },
          dialogFormVisible: false,
          dialogStatus: '',
          storeOptions:[],
          sexOptions: [
            {
              name: '男',
              value: 1
            },
            {
              name: '女',
              value: 0
            }
          ],
          textMap: {
            update: '编辑',
            create: '创建'
          },
          tableKey: 0
        }
      },
      created() {
        this.getList();
        getAllStores({userId:null}).then(response => {
          this.storeOptions = response.data;
        })
      },
      methods: {
        getList() {
          this.listLoading = true;
          getUserList(this.listQuery).then(response => {
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
          deleteSystemUser(row.userId).then(response => {
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
          this.$refs.userForm.validate(valid => {
            if (valid) {
              this.temp.creater = store.getters.name;
              this.temp.modify = store.getters.name;
              addSystemUser(this.temp).then(response => {
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
          this.$refs.userForm.validate(valid => {
            if (valid) {
              this.temp.modify = store.getters.name;
              updateSystemUser(this.temp).then(response => {
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
            userName: undefined,
            userPassword: undefined,
            userPhone: undefined,
            userSex: undefined,
            userAddress: undefined,
            createDateTime: undefined,
            storeId:undefined,
            creater: undefined
          };
        },
        handleDownload() {
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel');
            const tHeader = ['用户名', '密码', '用户角色', '联系方式', '创建人', '创建时间', '地址'];
            const filterVal = ['userName', 'userPassword', 'userRole', 'userPhone', 'creator', 'createDateTime', 'userAddress'];
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
