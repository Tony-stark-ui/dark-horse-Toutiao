<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <template #title>
        <van-button
          class="search-button"
          round
          icon="search"
          type="info"
          size="small"
          to="/search"
          >搜索</van-button
        >
      </template>
    </van-nav-bar>

    <!-- 文章频道列表 -->
    <van-tabs v-model:active="active" class="channel-tabs">
      <van-tab
        v-for="(item, index) in channels"
        :key="item.id"
        :title="item.name"
      >
        <!-- 文章列表 -->
        <article-list :channel="item"></article-list>
      </van-tab>
      <template v-slot:nav-right slot-scope="scope">
        <div @click="isChannelEditShow = true" class="wap-nav-wrap">
          <van-icon name="bars" />
        </div>
      </template>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      v-model:show="isChannelEditShow"
      round
      position="bottom"
      :style="{ height: '100%' }"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      get-container="body"
    >
      <!-- 弹出层里面的内容 -->
      <channeledit
        :channel="channels"
        :active="active"
        @switchChanel="switchChanel"
        v-model="active"
      ></channeledit>
    </van-popup>
  </div>
</template>

<script>
//引入文章列表组件
import ArticleList from "./childComps/ArticleList";

//引入频道编辑内容组件
import Channeledit from "../../components/content/channelEdit/ChannelEdit.vue";

//引入获取文章列表数据的请求方法
import { getUserChannels } from "@/network/user";

//引入vuex容器中的用户登录状态
import { mapState } from "vuex";
//引入封装的获取本地存储的方法
import { getItem } from "@/utils/storage";

export default {
  name: "home",

  components: {
    ArticleList, //文章列表组件
    Channeledit, //频道编辑内容
  },

  directives: {},

  data() {
    return {
      active: 0, //控制被激活的标签
      channels: [], //频道列表的数据
      isChannelEditShow: false, //控制编辑频道的显示状态
    };
  },
  created() {
    //加载频道列表数据
    this.loadChannels();
  },
  computed: {
    //将用户登录状态映射到本地
    ...mapState(["user"]),
  },
  mounted() {},

  methods: {
    async loadChannels() {
      //请求频道列表数据
      //请求获取数据
      // const data = await getUserChannels();
      // this.channels = data.data.data.channels;
      // console.log(data);

      let channels = []; //用云存放登录或未登录状态的用户频道信息列表

      //判断用户有没有登录，登录的话从服务器拿数据，没有登录先看本地存储，有就拿，没有就调用推荐接口
      if (this.user) {
        //如果没有登录vuex中的user为null
        //已登录，请求获取线上的用户频道列表数据
        const { data } = await getUserChannels();
        channels = data.data.channels;
      } else {
        //没有登录 判断本地存储有没有数据
        const localChannels = getItem("userChannels");
        if (localChannels) {
          //如果有本地存储的频道列表则使用
          channels = localChannels;
        } else {
          //用户没有登录也没有本地存储的频道，那就请求获取默认的推荐频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }
      }
      //  将channnels变量赋值给channels，变量中存放的要么是登录的，要么是本地存储中的，要要么是推荐的
      this.channels = channels;
    },
    //自定义方法 ， 点击切换频道
    switchChanel(index) {
      // //切换频道
      // this.active = index;
      // 关闭弹出层
      this.isChannelEditShow = false;
      //切换频道
      this.active = index;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__title {
  max-width: none;
}
.search-button {
  background-color: #5babfb;
  width: 277px;
  height: 32px;
  border: none;
}
.channel-tabs {
  /deep/ .van-tabs__line {
    width: 15px;
    height: 3px;
    background-color: #3296fa;
  }
}

.wap-nav-wrap {
  position: fixed;
  right: 0;
  height: 44px;
  line-height: 44px;
  font-size: 26px;
  background-color: #fff;
  opacity: 0.9;
  width: 33px;
}
</style>