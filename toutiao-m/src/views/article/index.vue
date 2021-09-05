<template>
  <div class="Article">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="文章详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    />
    <div class="main">
      <!-- 文章标题 -->
      <h1 class="title">{{ article.title }}</h1>

      <!-- 作者详情 -->
      <van-cell center class="userInfo">
        <!-- 作者名称 -->
        <template #title>
          <div class="name">{{ article.aut_name }}</div>
        </template>
        <!-- 头像 -->
        <template #icon
          ><van-image class="avatar" round :src="article.aut_photo"
        /></template>
        <!-- 发布时间 -->
        <template #label>
          <div class="pubdate">{{ time }}</div>
        </template>
        <!-- 右侧关注按钮 -->
        <van-button
          :icon="article.is_followed ? '' : 'plus'"
          round
          size="small"
          :type="article.is_followed ? 'default' : 'info'"
          :class="article.is_followed ? '' : 'close-btn'"
          @click="onFollow"
          :loading="isFollowLoading"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <!-- 文章内容 -->
      <div
        class="content markdown-body"
        v-html="article.content"
        ref="articleContent"
      ></div>
    </div>
    <!-- 文章评论列表 -->
    <comment-list
      :source="articleId"
      :list="commentList"
      @updateTotalCount="totalCommentCount = $event"
      @replyClick="onReply"
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
      <!-- 评论 -->
      <van-icon color="#777" name="comment-o" :badge="totalCommentCount" />
      <!-- 收藏 -->
      <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollected"
      />
      <!-- 点赞 -->
      <van-icon
        :color="article.attitude === 1 ? 'red' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onAttitude"
      />
      <!-- 转发 -->
      <van-icon color="#777" name="share-o" />
    </div>
    <!-- 发布评论 -->
    <van-popup position="bottom" closeable v-model:show="show">
      <!-- 评论内容 -->
      <post-comment
        :target="articleId"
        @postSuccess="postSuccess"
      ></post-comment>
    </van-popup>
    <!-- 评论回复 -->
    <van-popup position="bottom" closeable v-model:show="replyShow">
      <!-- 评论内容 -->
      <comment-reply
        :articleId="articleId"
        v-if="replyShow"
        :comment="replyComment"
      ></comment-reply>
    </van-popup>
  </div>
</template>

<script>
//引入第三方样式
import "./style/markdown-css.css";

// 引入评论列表
import CommentList from "./childComps/CommentList";
//引入发布评论的内容组件
import PostComment from "./childComps/PostComment";

// 引入评论回复的内容组件
import CommentReply from "./childComps/CommentReply.vue";

//引入文章详情的网络请求
import {
  getArticleById,
  getCollected,
  deleteCollected,
  addAttitude,
  deleteAttitude,
} from "../../network/article";
// 引入关注用户，取消关注的网络请求方法
import { addFollow, deleteFollow } from "../../network/user";

//引入相对时间工具函数
import { time } from "../../utils/dayjs";

// 引入图片预览组件
import { ImagePreview } from "vant";

export default {
  name: "ArticleIndex",
  props: {
    // 这是通过props动态传递路由参数,相当于this.$route.params.xxx一样获取路由中传递的params参数
    articleId: {
      type: [String, Number, Object], //url里面都是字符串
      required: true,
    },
  },

  components: {
    CommentList, //评论列表
    PostComment, //评论内容
    CommentReply, //评论回复组件
  },

  directives: {},

  data() {
    return {
      article: {}, //文章数据
      isFollowLoading: false, //关注用户loading状态
      isCollectiLoading: false, //收藏的loading状态
      show: false, //弹出层状态
      commentList: [], //文章评论列表
      totalCommentCount: 0, //评论总数量
      replyShow: false, //评论回复弹出层状态
      replyComment: {}, //当前评论回复对象
    };
  },
  created() {
    // 发送网络请求获取文章详情
    this.loadArticle();
  },
  computed: {
    time() {
      return time(this.article.pubdate);
    },
  },

  mounted() {},

  methods: {
    //发送网络请求获取文章详情
    async loadArticle() {
      const { data } = await getArticleById(this.articleId);
      this.article = data.data;

      /*数据改变影响视图更新（dom数据）不是立即的
        所以如果需要在修改数据之后马上操作该数据影响的视图dom，需要把这改代码放到&nextTick中
      */
      // 得到所有img标签
      // this.$nextTick是vue中提供的一个方法
      await this.$nextTick(() => {
        // 调用图片预览方法，逻辑写在下面比较清晰
        this.previewImg();
      });
    },

    // 图片预览方法
    previewImg() {
      // 获取文章内容dom容器
      const articleContent = this.$refs.articleContent;

      // 得到img标签
      const imgs = articleContent.querySelectorAll("img");
      console.log(imgs);

      //存放图片地址
      const images = [];

      // 循环img列表，给img注册点击事件
      imgs.forEach((item, index) => {
        // 遍历一次添加一次图片地址到数组
        images.push(item.src);
        // 给每一个图片添加点击事件
        item.onclick = function () {
          // 在事件处理函数中调用图片预览方法
          ImagePreview({
            images: images,
            startPosition: index,
          });
        };
      });
    },

    // 关注和取消点击事件
    async onFollow() {
      // 已关注，取消关注；没关注，添加关注
      if (this.article.is_followed) {
        //已关注，取消关注
        await deleteFollow(this.article.aut_id);
        this.article.is_followed = false;
      } else {
        // 没关注,添加关注
        this.article.is_followed = true;
        await addFollow(this.article.aut_id);
      }
    },

    // 收藏和取消收藏
    // async onCollected() {
    //   //已收藏，点击取消
    //   if (this.article.is_collected) {
    //     await getCollected(this.articleId);
    //   } else {
    //     // 没收藏，点击收藏
    //     await deleteCollected(this.articleId);
    //   }
    //   this.article.is_collected = !this.article.is_collected;
    // },
    onCollected() {
      this.$toast.loading({
        message: "操作中...",
        fordibClick: true, //禁止背景点击
      });
      //已收藏，点击取消  没收藏，点击收藏
      this.article.is_collected = !this.article.is_collected;
      this.$toast.success(`${this.article.is_collected ? "" : "取消"}收藏成功`);
    },

    // 点赞和取消点赞
    // async onAttitude() {
    //   // 已点赞，点击取消
    //   if (this.article.attitude === 1) {
    //     await addAttitude(this.articleId);
    //     this.article.attitude === -1;
    //   } else {
    //     // 没点赞,点击点赞
    //     await deleteAttitude(this.articleId);
    //     this.article.attitude=== 1;
    //   }
    // },
    onAttitude() {
      // 已点赞，点击取消
      if (this.article.attitude === 1) {
        this.article.attitude = -1;
      } else {
        // 没点赞,点击点赞
        this.article.attitude = 1;
      }
    },
    // 点击评论
    showPopup() {
      this.show = true;
    },
    // 文章评论发布成功的事件
    postSuccess(comment) {
      // 把发布成功的数据对象放到评论列表顶部
      this.commentList.unshift(comment);
      // 更新评论的总数量
      this.totalCommentCount++;
      // 关闭发布评论的弹出层
      this.show = false;
      // 清空评论内容
      this.message = "";
    },
    // 点击回复评论
    onReply(comment) {
      // 当前评论回复对象传递给commentReply组件
      this.replyComment = comment;
      // 展示回复内容
      this.replyShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
.Article {
  padding-bottom: 50px;
}
.app-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
.main {
  padding-top: 46px;
}
.title {
  font-size: 22px;
  color: #3a3a3a;
  font-weight: 700;
  padding: 14px;
  background-color: #fff;
}
.userInfo {
  /deep/ .name {
    font-size: 14px;
    color: #333;
  }
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .pubdate {
    color: #b4b4b4;
  }

  /deep/ .close-btn {
    background-color: hsl(210, 97%, 65%);
    border: none;
    color: #fff;
    padding: 0 18px;
  }
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
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
    flex: 2;
    color: #777;
    padding: 0 40px;
    // margin-right: 15px;
  }
  .van-icon {
    font-size: 24px;
    flex: 1;
  }
}
</style>