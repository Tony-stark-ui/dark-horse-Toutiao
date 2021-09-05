<template>
  <div class="Commentreply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`"></van-nav-bar>

    <!-- 当前评论项 -->
    <comment-item :comment="comment"></comment-item>

    <!-- 评论的评论 -->
    <van-cell title="所有回复"> </van-cell>
    <!-- 评论的评论 -->
    <comment-list
      :source="comment.com_id"
      type="c"
      :list="commentList"
    ></comment-list>
    <!-- 底部工具栏 -->
    <div class="footerBar">
      <van-button
        class="commit-btn"
        type="default"
        round
        size="small"
        @click="showPopup"
      >
        写评论
      </van-button>
    </div>
    <!-- 发布评论 -->
    <!-- 评论回复 -->
    <van-popup position="bottom" closeable v-model:show="show">
      <post-comment
        :target="comment.com_id"
        :articleId="articleId"
        @postSuccess="onPostSuccess"
      ></post-comment>
    </van-popup>
  </div>
</template>

<script>
// 引入评论列表项
import CommentItem from "./CommentItem.vue";
// 引入评论列表
import CommentList from "./CommentList";
// 发布评论组件
import PostComment from "./PostComment.vue";

//引入评论回复网络请求方法
import { addPost } from "@/network/comment";

export default {
  name: "Commentreply",
  props: {
    // 查看回复的评论项
    comment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },

  components: {
    CommentItem, //评论项
    CommentList, //评论列表
    PostComment, //发布评论
  },

  directives: {},

  data() {
    return {
      show: false, //评论回复弹出层状态
      commentList: [], //评论的评论列表
    };
  },

  mounted() {},

  methods: {
    // 点击评论
    showPopup() {
      this.show = true;
    },
    onPostSuccess(comment) {
      // 将发布成功的评论放到评论列表的顶部
      this.commentList.unshift(comment);
      // ，更新评论的回复数量
      this.comment.reply_count++;
      // 关闭弹出层
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.Commentreply {
  padding-bottom: 50px;
}
.footerBar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  line-height: 50px;
  padding: 0 12px;
  text-align: center;
  .commit-btn {
    flex: 1;
    color: #777;
    padding: 0 40px;
    // margin-right: 15px;
  }
}
</style>