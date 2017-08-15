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
        const myCanvas = this.$refs.qart.children[0];
        //获取对应的CanvasRenderingContext2D对象(画笔)
        const ctx = myCanvas.getContext("2d");
        ctx.save();
        //设置字体样式
        ctx.font = "20px Courier New";
        //设置字体填充颜色
        ctx.fillStyle = "#337ab7";
        //从坐标点(50,50)开始绘制文字
        ctx.fillText("餐桌编号：" +　config.data, 30, 80);
      },
      convertToImage(){
        const myCanvas = this.$refs.qart.children[0];
        const type = 'image/png';
        let image = myCanvas.toDataURL(type).replace(type, "image/octet-stream");
        window.location.href = image; // it will save locally
      }
    }
  }
</script>

