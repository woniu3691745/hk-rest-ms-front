<template>
  <div class="app-container calendar-list-container">
    <h2>{{textMap[formStatus]}}菜品</h2>
    <el-form class="small-space" ref="menuForm" :rules="menuRules" :model="temp" label-position="right" label-width="150px" style='width: 800px; margin-left:50px;'>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜名" prop="dishesName">
            <el-input v-model="temp.dishesName" name = "dishesName"></el-input>
          </el-form-item>

          <el-form-item label="价格" prop="dishesPrice">
            <el-input v-model.number="temp.dishesPrice" name = "dishesPrice"></el-input>
          </el-form-item>

          <el-form-item label="折扣" prop="dishesDiscountPrice">
            <el-input-number v-model="temp.dishesDiscountPrice" name = "dishesDiscountPrice" :min="0" :max="1" :step="0.05"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="菜系分类">
            <el-select v-model="temp.dishesCategory" placeholder="请选择">
              <el-option v-for="item in dishesCategoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否素食">
            <el-select v-model="temp.isVegetarian" placeholder="请选择">
              <el-option v-for="item in isVegetarianOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if="temp.dishesCategory === 1">
          <el-form-item label="饮品选项">
            <el-select v-model="temp.dishesWaterStatus" placeholder="请选择">
              <el-option v-for="item in waterStatusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span=12>
          <el-form-item label="库存" prop="stock">
            <el-input v-model.number="temp.stock" name = "stock"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="剩余库存" prop="overplusStock">
            <el-input v-model.number="temp.overplusStock" name="overplusStock"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="创建者" v-if="formStatus=='create'" prop="create">
            <el-input v-model="temp.creater" name="creator" placeholder="输入字符不要超过16位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改者" prop="modify">
            <el-input v-model="temp.modify" name="modifier" placeholder="输入字符不要超过16位"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="菜品介绍">
        <el-input v-model="temp.dishesDescription" type="textarea" :autosize="{minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
      </el-form-item>

      <el-form-item label="菜品图片"></el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="formStatus=='create'" type="primary" @click="create">确 定</el-button>
      <el-button v-else type="primary" @click="update">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
    import { parseTime } from 'utils';

    import ImageCropper from 'components/ImageCropper';
    import PanThumb from 'components/PanThumb';
    import Dropzone from 'components/Dropzone';

    import store from 'store';

    import { getAllMenus, addMenu, updateMenu } from 'api/storeMenu';

    export default {
      components: { ImageCropper, PanThumb, Dropzone },
      name: 'table_demo',
      data() {
        //const menuId = this.$route.params.menuId;
        const dishesId = this.$route.params.dishesId,
              storeId = this.$route.params.storeId,
              dishesCategory = this.$route.params.dishesCategory;

        return {
          dishesId: dishesId,
          storeId: storeId,
          menuInfoQuery: {
            menuId: storeId,
            dishesId: dishesId,
            storeId: storeId,
            dishesCategory: dishesCategory
          },
          //backFlag:false,
          temp: {
            dishesPrice: undefined,
            dishesName: undefined,
            dishesDiscountPrice: undefined,
            dishesCategory: undefined,
            dishesWaterStatus: undefined,
            isVegetarian: undefined,
            stock: undefined,
            overplusStock: undefined,
            creater: undefined,
            modify: undefined,
            dishesDescription: undefined,
          },
          menuRules: {
            dishesName: [
                { required: true, trigger: 'blur', message: '菜名称不能为空' }
            ],
            dishesPrice: [
                { type: 'number', message: '价格必须为数字值', required: true },
                { type: 'number', message: '价格必须在0~1000之间', max: 999.99, min: 0 }
            ],
            stock: [
              { type: 'number', message: '库存必须为数字' },
              { type: 'number', message: '库存输入不合理，请重新输入', min: 0, max: 2147483647 }
            ],
            overplusStock: [
              { type: 'number', message: '剩余库存必须为数字' },
              { type: 'number', message: '剩余库存输入不合理，请重新输入', min: 0, max: 2147483647 }
            ],
            modify: [
              { type: 'string', message: '字符串过长，请重新输入', max: 16 }
            ],
            create: [
              { type: 'string', message: '字符串过长，请重新输入', max: 16 }
            ]
          },
          formStatus: dishesId != null ? 'update' : 'create',
          textMap: {
            update: '编辑',
            create: '创建'
          },
          dishesCategoryOptions: [{
            value: 0,
            label: '热菜'
          },{
              value: 1,
              label: '冷饮'
          },{
              value: 2,
              label: '特色'
          },{
              value: 3,
              label: '其他'
          }],
          isVegetarianOption: [{
            value: 0,
            label: '否'
          },{
            value: 1,
            label: '是'
          }],
          waterStatusOption: [{
            value: 0,
            label: '不加冰'
          },{
            value: 1,
            label: '加冰'
          },{
            value: 2,
            label: '加糖'
          },{
            value: 3,
            label: '不加糖'
          }]
        }
      },
      created() {
        var dishesId = this.$data.dishesId;
        if(dishesId){
          getAllMenus(this.$data.menuInfoQuery).then(response => {
            this.temp = response.data[0];
          })
        }
      },
      methods: {
        backStorePage(){
          //this.$data.backFlag = true;
          var storeId = this.$data.storeId;
          this.$store.dispatch('delVisitedViews', this.$store.state.app.currentView);
          this.$router.push({
            path: '/store/storeMenu/'+storeId
          });
        },
        create() {
          this.$refs.menuForm.validate(valid => {
            if (valid) {
              var storeId = this.$data.storeId;
              this.temp.storeId = storeId;
              addMenu(this.temp).then(response => {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.backStorePage();
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        cancel() {
          this.backStorePage();
        },
        update() {
          this.$refs.menuForm.validate(valid => {
            if (valid) {
              updateMenu(this.temp).then(response => {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.backStorePage();
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      }
    }
</script>
<style scoped>
.dialog-footer {
  text-align: center;
}
</style>