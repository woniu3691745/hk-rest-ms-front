<template>
  <div class="app-container calendar-list-container">
    <h2>{{textMap[formStatus]}}门店</h2>
    <el-form class="small-space" ref="storeForm" :rules="menuRules" :model="temp" label-position="right" label-width="150px" style='width: 800px; margin-left:50px;'>
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="150px" label="店名" prop="storeName">
            <el-input v-model="temp.storeName" name ="storeName"></el-input>
          </el-form-item>
          <el-form-item label-width="150px" label="店主" prop="storeAdmin">
            <el-input v-model="temp.storeAdmin" name ="storeAdmin"></el-input>
          </el-form-item>
          <el-form-item label="餐位费" prop="seatCost">
            <el-input v-model="temp.seatCost" name ="seatCost"></el-input>
          </el-form-item>
          <el-form-item label="服务费" prop="serviceCost">
            <el-input v-model="temp.serviceCost" name ="serviceCost"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <PanThumb :image='image'></PanThumb><br>
            <el-button type="primary" icon="upload" style="position: absolute;margin-left: 10px;" @click="imagecropperShow=true">修改门店logo
            </el-button>

            <ImageCropper :width="300" :height="300" url="/api/store/storeLogoUpload" @close='close' @crop-upload-success="cropSuccess"
              :key="imagecropperKey" v-show="imagecropperShow" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上午营业时间">
            <el-time-select v-model="temp.storeBusinessAmStartHours" 
            :picker-options="{start: '00:00',step: '00:30',end: '12:00'}"></el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到">
            <el-time-select v-model="temp.storeBusinessAmEndHours" 
            :picker-options="{start: '00:00',step: '00:30',end: '12:00'}"></el-time-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="下午营业时间">
            <el-time-select v-model="temp.storeBusinessPmStartHours" 
            :picker-options="{start: '12:00',step: '00:30',end: '24:00'}"></el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到">
            <el-time-select v-model="temp.storeBusinessPmEndHours" 
            :picker-options="{start: '12:00',step: '00:30',end: '24:00'}"></el-time-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="营业日期">
            <el-input v-model="temp.storeBusinessDay"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话">
            <el-input v-model="temp.storePhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="通知">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.storeNotice">
        </el-input>
      </el-form-item>

      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.userDescription">
        </el-input>
      </el-form-item>

      <el-form-item label="门店图片">
        <Dropzone  v-on:dropzone-removedFile="dropzoneR" v-on:dropzone-success="dropzoneS" id="myVueDropzone"
            url="api/store/storeImgUpload" :defaultImg = 'defaultImg'></Dropzone>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="formStatus=='create'" type="primary" @click="create">确 定</el-button>
      <el-button v-else type="primary" @click="update">确 定</el-button>
    </div>
  </div>
</template>

<script>
    import { parseTime } from 'utils';

    import ImageCropper from 'components/ImageCropper';
    import PanThumb from 'components/PanThumb';
    import Dropzone from 'components/Dropzone';

    import store from 'store';

    import { getStoreImages, getAllStores, updateStore, addStore} from 'api/store';

    export default {
      components: { ImageCropper, PanThumb, Dropzone },
      name: 'table_demo',
      data() {
        const storeId = this.$route.params.storeId || store.getters.storeId;
        return {
          imagecropperShow: false,
          storeId:storeId,
          imagecropperKey: 0,
          image: '',
          defaultImg: '',
          temp: {
            storeBusinessAmStartHours: undefined,
            storeBusinessAmEndHours: undefined,
            storeBusinessPmStartHours: undefined,
            storeBusinessPmEndHours: undefined
          },
          menuRules: {
            storeName: [
                { required: true, trigger: 'blur' }
            ]
          },
          formStatus: storeId != null ? 'update' : 'create',
          textMap: {
            update: '编辑',
            create: '创建'
          }
        }
      },
      created() {
        this.image = '/api/store/storeLogoDown/img.jpg';
        // this.defaultImg = ["/api/sysUser/headDowns"];
        getStoreImages().then(response => {
          this.defaultImg = response.data;
        });
        var storeId = this.$data.storeId;
        if(storeId){
          getAllStores({storeId:storeId}).then(response => {
            this.temp = response.data[0];
          })
        }
      },
      methods: {
        create() {
          this.$refs.storeForm.validate(valid => {
            if (valid) {
              addStore(this.temp).then(response => {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.$store.dispatch('delVisitedViews', this.$store.state.app.currentView);
                  this.$router.push({
                  path: '/store/store'
                });
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        update() {
          this.$refs.storeForm.validate(valid => {
            if (valid) {
              updateStore(this.temp).then(response => {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.$store.dispatch('delVisitedViews', this.$store.state.app.currentView);
                  this.$router.push({
                  path: '/store/store'
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
        logoFinish(){
          this.imagecropperShow = false;
          this.imagecropperKey = this.imagecropperKey + 1;
          this.image = '/api/store/storeLogoDown/img.jpg?l=' +　new Date().getTime();
        },
        cropSuccess() {
          this.logoFinish();
        },
        close() {
          this.imagecropperShow = false;
          //this.logoFinish(); 
        },
        dropzoneS(file) {
          console.log(file)
          this.$message({ message: '上传成功', type: 'success' });
        },
        dropzoneR(file) {
          // console.log(file)
          // this.$message({ message: '删除成功', type: 'success' });
          delStoreImages(file.url).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
          })
        }
      }
    }
</script>

<style scoped>
.avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.dialog-footer {
  text-align: center;
}
</style>
