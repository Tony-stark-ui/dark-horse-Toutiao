
<template>
  <div class="artice">
    <!-- 文章列表组件 -->
    <!-- //下拉刷新 -->
    <van-pull-refresh
      v-model="isPullDownLoading"
      @refresh="onRefresh"
      success-text="refreshSuccessText"
    >
      <div class="article-list">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          class="article-list"
        >
          <!-- <van-cell
            v-for="(item, index) in articles"
            :title="item.title"
            :key="index"
          /> -->
          <article-item
            v-for="(item, index) in articles"
            :key="index"
            :article="item"
          ></article-item>
        </van-list>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
//引入网络请求方法
import { getArticles } from "@/network/article";

//引入列表项组件
import ArticleItem from "../../../components/common/article-item";
export default {
  name: "ArticleList",
  props: {
    //接收父组件传过来的当前列表项
    channel: {
      type: Object,
      required: true, //必须给的数据
    },
  },

  components: {
    ArticleItem, //文章列表项组件
  },

  directives: {},

  data() {
    return {
      articles: [], //数据列表
      loading: false, //控制加载中的loading状态
      finished: false, //控制加载结束的状态，为true不再加载显示没有更多
      timestamp: null, //时间戳 相当于页码
      isPullDownLoading: false, //下拉刷新的loading状态
      refreshSuccessText: "", //下拉刷新成功提示
    };
  },

  mounted() {},
  methods: {
    async onLoad() {
      //请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, //频道的id
        timestamp: this.timestamp || Date.now(), //时间戳(类似与分页 相当于页码），请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1, //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      });

      //把数据合并到articles数组中
      const { results } = data.data;
      this.articles.push(...results);

      //设置本次加载状态结束，他才可以判断是否需要加载下一次，否则就会永远的停在这里
      this.loading = false;

      //数据全部加载完成
      if (results.length) {
        //更新获取下一页数据
        this.timestamp = data.data.pre_timestamp;
      } else {
        //没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true;
      }
    },
    //下拉刷新方法
    async onRefresh() {
      //下拉刷新组件自己就会展示loading状态
      //请求获取数据
      //请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, //频道的id
        timestamp: Date.now(), //时间戳(类似与分页 相当于页码），请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1, //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      });

      // 把数据放到数据列表中（往顶部追加）
      this.articles.unshift(...data.data.results);
      //关闭刷新状态loa
      this.isPullDownLoading = false;
      //刷新成功提示文字
      this.refreshSuccessText = "刷新成功";
    },
  },
};
</script>

<style lang="less" scoped>
.artice {
  height: 83vh;
  overflow-y: auto;
}
// .article-list {
//   position: fixed;
//   left: 0;
//   right: 0;
//   bottom: 131px;
//   top: 128px;
//   overflow-y: auto;
//   background-color: pink;
//   z-index: 999;
// }
</style>