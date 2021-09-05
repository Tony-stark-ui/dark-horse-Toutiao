<template>
  <div class="Updatephoto">
    <img class="image" :src="img" alt="" ref="image" />
    <van-nav-bar
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
      class="nav-bar"
    ></van-nav-bar>
  </div>
</template>

<script>
// 引入网络请求方法
import { editPhoto } from "@/network/user";

// 引入裁切插件
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

export default {
  name: "Updatephoto",
  props: {
    file: {
      type: File,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      img: window.URL.createObjectURL(this.file),
      cropper: null, //裁切器实例
    };
  },

  mounted() {
    // 获取需要裁切的图片dom
    const image = this.$refs.image;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },

  methods: {
    getCroppedCanvas() {
      return new Promise((res) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          res(blob);
        });
      });
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, //背景点击
        duration: 0, //展示时间，0表示持续展示
      });
      const file = await this.getCroppedCanvas();
      const fd = new FormData();
      fd.append("photo", file);
      await editPhoto(fd);

      this.$toast.success("保存成功");

      const img = window.URL.createObjectURL(file);
      // 更新父组件中的用户头像
      this.$emit("updatePhoto", img);
    },
  },
};
</script>

<style lang="less" scoped>
.Updatephoto {
  .van-nav-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .image {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
  /deep/ .cropper-container {
    position: absolute;
    top: 50%;
    margin-top: -50%;
  }
  .nav-bar {
    background-color: #000;
  }
}
</style>