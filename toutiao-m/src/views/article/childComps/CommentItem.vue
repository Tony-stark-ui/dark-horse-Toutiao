<template>
  <div class="Commentitem">
    <van-cell class="item">
      <!-- 头像 -->
      <template #icon>
        <van-image class="avatar" round fit="cover" :src="comment.aut_photo" />
      </template>

      <template #title>
        <div class="title-wrap">
          <!-- 作者名 -->
          <div class="title">
            {{ comment.aut_name }}
          </div>
          <!-- 右侧图标 -->
          <div class="right-icon" @click="onCommentLike">
            <van-icon
              :name="comment.is_liking ? 'good-job' : 'good-job-o'"
              :color="comment.is_liking ? 'red' : ''"
            />
            <span>{{ comment.like_count }}</span>
          </div>
        </div>

        <!-- 评论内容 -->
        <div class="content">
          {{ comment.content }}
        </div>
        <!-- 评论时间 -->
        <div class="timer">
          <span>{{ datatime }}</span>
          <!-- 回复按钮 -->
          <van-button
            class="reply-btn"
            round
            size="mini"
            @click="$emit('replyClick', comment)"
            >{{ comment.reply_count }}回复</van-button
          >
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
//引入时间日期格式化
import { datatime } from "../../../utils/dayjs";

// 引入点赞和取消点赞的网络请求方法
import { deleteCommentLike, addCommentLike } from "@/network/comment";
export default {
  name: "Commentitem",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {};
  },
  computed: {
    datatime() {
      return datatime(this.comment.pubdate);
    },
  },
  mounted() {},

  methods: {
    // 点赞
    async onCommentLike() {
      const commentId = this.comment.com_id.toString();
      // 已点赞，点击取消
      if (this.comment.is_liking) {
        await deleteCommentLike(commentId);
        this.comment.like_count--;
      } else {
        // 没点赞，点击点赞
        await addCommentLike(commentId);
        this.comment.like_count++;
      }
      // 更新视图
      this.comment.is_liking = !this.comment.is_liking;
    },
  },
};
</script>

<style lang="less" scoped>
.item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .title {
    font-size: 14px;
    color: #406599;
  }
  .content {
    font-size: 16px;
    color: #222222;
  }
  .timer {
    font-size: 10px;
    display: flex;
    align-items: center;
  }
  .reply-btn {
    margin-left: 5px;
  }
  .right-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>