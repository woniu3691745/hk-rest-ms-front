<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="菜单名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
     <el-button v-if="addBtnRole" class="filter-item" style="margin-left: 10px;"  type="primary" icon="edit" @click="createMenu">添加</el-button>
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

      <el-table-column width="80px" align="center" label="菜品分类">
        <template scope="scope">
          <span>{{toCategoryText(scope.row.dishesCategory)}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="是否素食">
        <template scope="scope">
          <span>{{toIsVegetarianText(scope.row.isVegetarian)}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="库存">
        <template scope="scope">
          <span>{{scope.row.stock}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="剩余库存">
        <template scope="scope">
          <span>{{scope.row.overplusStock}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="创建者">
        <template scope="scope">
          <span>{{scope.row.creater}}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="修改者">
        <template scope="scope">
          <span>{{scope.row.modify}}</span>
        </template>
      </el-table-column>

      <el-table-column width="270px" align="center" label="操作">
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

  </div>
</template>

<script>
    import { getMenusByPage, addMenu, deleteMenu, updateMenu } from 'api/storeMenu';
    import { parseTime } from 'utils';

    import store from 'store';

    export default {
      name: 'table_demo',
      data() {
        const storeId = this.$route.params.storeId || store.getters.storeId;
        var roles = store.getters.roles;
        const category = ['热菜', '冷饮', '特色', '其他'];
        const isVegetarianText = ['否', '是'];
        return {
          addBtnRole:roles.indexOf("boss")>-1 || roles.indexOf("user")>-1,
          storeId:storeId,
          list: null,
          total: null,
          listLoading: true,
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
          tableKey: 0,
          category: category,
          isVegetarianText: isVegetarianText
        }
      },
      created() {
        this.getList();
      },
      methods: {
        getList() {
          this.listLoading = true;
          getMenusByPage(this.listQuery).then(response => {
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
        createMenu() {
          const storeId = this.$data.storeId;
          this.$router.push({
            path:'/store/storeMenuInfo/'+ storeId
          });
        },
        handleUpdate(row) {
          const storeId = this.$data.storeId;
          this.$router.push({
            path:'/store/storeMenuInfo/' + storeId + '/' + row.dishesId
          });
        },
        handleDelete(row) {
          deleteMenu(row.dishesId).then(() => {
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
        },
        toCategoryText(val) {
          return this.category[val];
        },
        toIsVegetarianText(val) {
          return this.isVegetarianText[val];
        }
      }
    }
</script>