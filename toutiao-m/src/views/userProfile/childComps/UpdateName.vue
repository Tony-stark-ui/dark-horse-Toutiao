<template>
  <div class="Updatename">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      right-text="完成"
    >
    </van-nav-bar>
    <!-- 输入框 -->
    <div class="name-wrap">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入留言"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
// 引入网络请求方法，编辑资料
import { editProfile } from "@/network/user";
export default {
  name: "Updatename",
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      message: this.name, //输入框内容
    };
  },

  mounted() {},

  methods: {
    // 顶部导航兰取消按钮
    onClickLeft() {
      this.$emit("close");
    },
    // 完成按钮
    async onClickRight() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, //禁止背景点击
      });
      try {
        //  请求提交更新用户昵称
        await editProfile({
          name: this.message,
        });
        // 更新成功：-》修改父组件的name -》 关闭弹出层
        this.$toast.success("保存成功");
        this.$emit("onClickLeft", this.message);
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail("昵称已存在");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.name-wrap {
  padding: 10px;
}
</style>