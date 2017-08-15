<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleCreate()">添加</el-button>
      <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleMulCreate()">批量添加</el-button>
      <el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button>
    </div>

    <el-row v-loading.body="listLoading">
      <el-col :span="5" v-for="(item, index) in list" :key="item" :offset="index%4 > 0 ? 1 : 0"  class="tableCard">
        <el-card :body-style="{ padding: '0px',textAlign: 'center'}">
          <div style="padding-top: 10px;">
            <span style="line-height: 30px;">餐桌编号：{{item.tableId}}</span><br>
            <span style="line-height: 30px;">餐桌状态：
              <el-tag :type="item.tableStatus | statusFilter">{{statusMap[item.tableStatus]}}</el-tag>
            </span>
          </div>
          <vue-q-art :config="{
            value: orderUrl + item.tableId,
            imagePath: '/image/companyLogo.jpeg',
            filter: 'color',
            size: 500
          }" :downloadButton="downloadButton"></vue-q-art>
          <div style="padding: 14px;">
            <div class="bottom clearfix">
              <el-button type="primary" icon="edit"></el-button>
              <el-button type="primary" icon="picture"></el-button>
              <el-button type="primary" icon="delete"></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form  class="small-space" ref="tableForm" :rules="tableRules" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item v-if="dialogStatus=='mulCreate'" label="餐桌个数" prop="tableNum">
          <el-input v-model="temp.tableNum" name = "tableNum"></el-input>
        </el-form-item>
        <el-form-item label="餐桌描述" prop="tableDiscription">
          <el-input v-model="temp.tableDiscription" name = "tableDiscription"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-if="dialogStatus=='mulCreate'" type="primary" @click="mulCreate">确 定</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import { getTablesByPage, addTable, deleteTable, updateTable } from 'api/storeTable';
    import VueQArt from 'components/vue-qart'
    import { parseTime } from 'utils';

    import store from 'store';

    export default {
      name: 'table_demo',
      components: {
        VueQArt
      },
      data() {
        const storeId = this.$route.params.storeId || store.getters.storeId,
              roles = store.getters.roles,
              validateTableNum = (rule, value, callback) => {
                if (value ==='' || value == null) {
                  callback(new Error('餐桌个数不能为空'));
                }else if (!Number.isInteger(value)) {
                  callback(new Error('餐桌个数必须为数字值'));
                }else {
                  callback();
                }
              };
        return {
          orderUrl:'https://localhost:9527/order/',
          tableConfig: {
            value: 'https://www.baidu.com',
            imagePath: '/image/companyLogo.jpeg',
            filter: 'color',
            size: 500
          },
          downloadButton: false,
          addBtnRole:roles.indexOf("boss")>-1,
          storeId:storeId,
          list: null,
          listLoading: false,
          listQuery: {
            page: 1,
            limit: 20,
            storeId: storeId
          },
          temp: {
            tableDiscription: undefined,
            tableNum:undefined
          },
          tableRules: {
            tableNum: [
                { validator: validateTableNum, trigger: 'blur'}
            ]
          },
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          statusMap: {
            0: '空闲',
            1: '点餐',
            2:'占用'
          },
          tableKey: 0
        }
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: 'success',
            1: 'gray',
            2: 'danger'
          };
          return statusMap[status]
        }
      },
      created() {
        this.getList();
      },
      methods: {
        getList() {
          this.listLoading = true;
          getTablesByPage(this.listQuery).then(response => {
            this.list = response.data[0];
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
        handleMulCreate() {
          this.resetTemp();
          this.dialogStatus = 'mulCreate';
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
          this.$refs.tableForm.validate(valid => {
            if (valid) {
              this.temp.creater = store.getters.name;
              this.temp.modify = store.getters.name;
              this.temp.storeId = this.$data.storeId;
              addTable(this.temp).then(response => {
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
        mulCreate() {
          this.$refs.tableForm.validate(valid => {
            if (valid) {
              this.temp.creater = store.getters.name;
              this.temp.modify = store.getters.name;
              this.temp.storeId = this.$data.storeId;
              addTable(this.temp).then(response => {
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
          this.$refs.tableForm.validate(valid => {
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
            tableDiscription: undefined,
            tableNum:undefined
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
<style scoped>
.tableCard {
  margin-top:10px;
}
</style>
