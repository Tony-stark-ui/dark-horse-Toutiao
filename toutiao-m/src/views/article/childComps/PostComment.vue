<template>
  <div class="Postcomment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入评论"
      show-word-limit
      class="textarea"
    />
    <van-button size="mini" class="btn" @click="onPost">发布</van-button>
  </div>
</template>

<script>
// 引入发布评论网络请求
import { addPost } from "@/network/comment";

export default {
  name: "Postcomment",
  props: {
    // 文章id
    target: {
      type: [Number, Object, String],
      required: true,
    },
    // 回复评论的回复文章id
    articleId: {
      type: [Number, Object, String],
      default: null,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      message: "", //输入框内容
    };
  },

  mounted() {},

  methods: {
    // 发布评论
    async onPost() {
      this.$toast.loading({
        message: "发布中",
        forbidClick: true,
      });
      try {
        //发送请求
        const { data } = await addPost({
          target: this.target.toString(), //要评论的文章id
          content: this.message, //评论内容
          art_id: this.articleId === null ? null : this.articleId.toString(), //文章id，对评论内容发表回复时需要传递参数，对文章评论不需要传递参数
        });
        // 处理响应结果，更新页面关闭弹出层
        this.$emit("postSuccess", data.data.new_obj);

        this.$toast.success("发布成功");
        this.message = "";
      } catch (err) {
        this.$toast.fail("发布失败，不能发送空内容");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.Postcomment {
  padding: 14px;
  display: flex;
  align-items: center;
  .textarea {
    flex: 3;
  }
  .btn {
    flex: 0.5;
  }
}
</style>