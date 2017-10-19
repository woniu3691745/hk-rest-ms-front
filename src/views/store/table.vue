<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container no-print">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleCreate()">添加</el-button>
      <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="handleMulCreate()">批量添加</el-button>
      <el-button class="filter-item" type="primary" icon="picture" @click="handleDownload">全部导出</el-button>
    </div>

    <div id="tableList">
      <el-row v-loading.body="listLoading">
        <el-col :span="5" v-for="(item, index) in list" :key="item" :offset="index%4 > 0 ? 1 : 0"  class="tableCard">
          <el-card :body-style="{ padding: '0px',textAlign: 'center'}">
            <div style="padding-top: 10px;" @click='orderMenu(item)'>
              <span style="line-height: 30px;">餐桌编号：{{item.tableId}}</span><br>
              <span style="line-height: 30px;" class="no-print">餐桌状态：
                <el-tag :type="item.tableStatus | statusFilter">{{statusMap[item.tableStatus]}}</el-tag>
              </span>
            </div>
            <vue-q-art ref="tableList" :config="{
              value: orderUrl + item.tableId,
              imagePath: '/image/companyLogo.jpeg',
              filter: 'color',
              size: 500,
              data:item.tableId
            }" :downloadButton="downloadButton">
              <el-button type="primary" size="small" icon="edit" class="no-print" @click='handleUpdate(item)'></el-button>
              <el-button type="primary" size="small" icon="delete" class="no-print" @click='handleDelete(item)'></el-button>
              <el-button type="primary" size="small" icon="check"class="no-print">结账</el-button>
            </vue-q-art>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form  class="small-space" ref="tableForm" :rules="tableRules" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item v-if="dialogStatus=='mulCreate'" label="餐桌个数" prop="tableNum">
          <el-input v-model="temp.tableNum" name = "tableNum"></el-input>
        </el-form-item>
        <el-form-item label="餐桌描述" prop="tableDescription">
          <el-input v-model="temp.tableDescription" name = "tableDescription"></el-input>
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
    import { getTablesByPage, addTable, deleteTable, updateTable, makeQRCodeImg, downLoadQRCodeZip} from 'api/storeTable';
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
            if (value === '' || value == null) {
              callback(new Error('餐桌个数不能为空'));
            } else if (!Number.isInteger(+value)) {
              callback(new Error('餐桌个数必须为数字值'));
            } else if (+value < 1) {
              callback(new Error('餐桌个数必须大于0'));
            } else {
              callback();
            }
          };
        return {
          orderUrl: 'https://localhost:9527/order/',
          downloadButton: false,
          addBtnRole: roles.indexOf('boss') > -1,
          storeId,
          list: null,
          listLoading: false,
          listQuery: {
            page: 1,
            limit: 20,
            storeId
          },
          temp: {
            tableDescription: undefined,
            tableNum: undefined
          },
          tableRules: {
            tableNum: [
                { validator: validateTableNum, trigger: 'blur' }
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
            1: '占用',
            2: '点餐'
    
          },
          tableKey: 0
        }
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            0: 'success',
            1: 'danger',
            2: 'gray'
          };
          return statusMap[status]
        }
      },
      created() {
        this.getList();
      },
      methods: {
        orderMenu(row){
          window.open("http://localhost:9528/#/goods/"+ this.$data.storeId + "/" +　row.tableId);
        },
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
          deleteTable(row.tableId).then(() => {
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
              const tableNum = this.temp.tableNum;
              for (let i = 0; i < +tableNum; i++) {
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
              }
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
              updateTable(this.temp).then(() => {
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
            tableDescription: undefined,
            tableNum: undefined
          };
        },
        saveFile(data, filename){
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = data;
          save_link.download = filename;
        
          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
        },
        handleDownload() {
          const tableList = this.$refs.tableList,
                tableImages = [],
                imageType = "data:image/octet-stream;base64,",
                storeId = this.$data.storeId;
          for (let i = 0; i < tableList.length; i++) {
            const temp = {},
                imageData = tableList[i].convertToImageData();
            temp.base64Img = imageData.substring(imageType.length);
            temp.tableName = "餐桌号" +　tableList[i].config.data;
            tableImages.push(temp);
          }
          makeQRCodeImg(tableImages,storeId).then(response => {
            if(response.status === 200){
              var $eleForm = $("<form method='get'></form>");
              var $eleForm = document.createElementNS('http://www.w3.org/1999/xhtml', 'form');
              $eleForm.method = "get";
              $eleForm.action = "api/table/" + storeId + "/downLoadQRCodeZip";
              document.body.appendChild($eleForm);
              //提交表单，实现下载
              $eleForm.submit();
              document.body.removeChild($eleForm);
              this.$notify({
                title: '成功',
                message: '正在导出门店餐桌二维码，请耐性等待...',
                type: 'success',
                duration: 2000
              });
            }
          })
          // window.print();
        }
      }
    }
</script>
<style scoped>
.tableCard {
  margin-top:10px;
}
</style>
