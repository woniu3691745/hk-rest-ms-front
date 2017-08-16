<template>
    <div>
        <div ref="qart"></div>
        <!--<button @click="convertToImage" v-if="downloadButton">download t2o image</button>-->
        <div style="padding: 14px;text-align: right;">
          <div class="bottom clearfix">
            <el-button type="primary" size="small" icon="picture" class="no-print" @click="convertToImage"></el-button>
            <slot></slot>
          </div>
        </div>
    </div>
</template>


<script type="application/ecmascript">
import QArt from 'qartjs';
  export default {
    props: ['config', 'downloadButton'],
    name: 'VueQart',
  
    data () {
      return {
        msg: '',
      }
    },
    watch: {
      'config.value': function (val, oldVal) {
        this.config.vaule = val;
        this.renderQrcode(this.config);
      console.log('new: %s, old: %s', val, oldVal)
      },
    },
    mounted(){
      this.renderQrcode(this.config)
    },
    
    methods: {
      renderQrcode(config){
        this.qart =  new QArt(config);
        this.qart.make(this.$refs.qart);
      },

      /**
       * 在本地进行文件保存
       * @param  {String} data     要保存到本地的图片数据
       * @param  {String} filename 文件名
       */
      saveFile(data, filename){
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = data;
          save_link.download = filename;
        
          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
      },
      convertToImageData(){
        const myCanvas = this.$refs.qart.children[0];
        const type = 'image/png';
        let image = myCanvas.toDataURL(type).replace(type, "image/octet-stream");
        return image;
      },
      convertToImage(){
        // const myCanvas = this.$refs.qart.children[0];
        // const type = 'image/png';
        // let image = myCanvas.toDataURL(type).replace(type, "image/octet-stream");
        let image = this.convertToImageData();
        this.saveFile(image,"餐桌号"+this.config.data);
        //window.location.href = image; // it will save locally
      }
    }
  }
</script>

