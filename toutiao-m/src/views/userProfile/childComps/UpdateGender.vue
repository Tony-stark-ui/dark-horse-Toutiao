<template>
  <div class="Updategender">
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="gender"
      @cancel="onCancel"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
// 引入网络请求方法，编辑资料
import { editProfile } from "@/network/user";

export default {
  name: "Updategender",
  props: {
    gender: {
      type: Number,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      columns: ["女", "男"],
      newGender: null,
    };
  },

  mounted() {},

  methods: {
    onGenderChange(index) {
      if (index === "男") {
        this.newGender = 1;
      } else {
        this.newGender = 0;
      }
    },
    // 点击取消
    onCancel() {
      this.newGender = this.gender;
      this.$emit("close");
    },
    // 点击确定
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, //禁止背景点击
      });

      //  请求提交更新用户昵称
      await editProfile({
        gender: this.newGender,
      });
      // 更新成功：-》修改父组件的name -》 关闭弹出层
      this.$toast.success("保存成功");
      this.$emit("onEditGender", this.newGender);
    },
  },
};
</script>

<style lang="less" scoped>
</style>