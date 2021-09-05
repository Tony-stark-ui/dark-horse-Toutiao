<template>
  <div class="searchContainer">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        shape="round"
        background="#3296fa"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <searchresult v-if="isResultShow" :searchText="searchText"></searchresult>
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- 历史记录 -->
    <search-history
      v-else
      :searchHistory="searchHistory"
      @search="onSearch"
      @updateHistories="searchHistory = $event"
    ></search-history>
  </div>
</template>

<script>
//引入联想建议组件
import SearchSuggestion from "./childComp/SearchSuggestion.vue";
// 引入历史记录组件
import SearchHistory from "./childComp/SearchHistory.vue";
// 引入搜索结果组件
import Searchresult from "./childComp/SearchResult.vue";

//引入获取用户搜索历史的请求方法
import { getHistories } from "@/network/search";

//将vuex容器中的用户登录状态映射到本地
import { mapState } from "vuex";

// 引入封装的本地存储方法
import { setItem, getItem } from "@/utils/storage";

export default {
  name: "Search",

  components: {
    SearchSuggestion, //联想建议组件
    SearchHistory, //历史记录组件
    Searchresult, //搜索结果组件
  },

  directives: {},

  data() {
    return {
      searchText: "", //搜索输入框的内容
      isResultShow: false, //控制搜索结果的显示状态
      searchHistory: [], //搜索历史,未登录时本地存储开始为null，那就给他一个空数组
      userHistory: [], //已登录用户的搜索记录
    };
  },
  created() {
    // 获取用户搜索历史
    this.getSearchHistories();
  },

  mounted() {},
  computed: {
    //将用户登录状态映射到本地
    ...mapState(["user"]),
  },

  methods: {
    //点击键盘上的搜索/回车按钮后触发
    onSearch(searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText;

      // 判断如果搜索历史重复就展示一个
      const index = this.searchHistory.indexOf(searchText);
      if (index != -1) {
        //如果重复,把重复项移除掉替换
        this.searchHistory.splice(index, 1);
      }
      // 不重复就把搜索结果加入数组
      this.searchHistory.unshift(searchText);

      //展示搜索结果
      this.isResultShow = true;
    },
    //点击搜索框右侧取消按钮时触发。
    onCancel() {
      //点击取消离开搜索页面
      this.$router.back();
    },
    // 获取用户搜索历史
    async getSearchHistories() {
      const { data } = await getHistories();

      this.userHistory = data.data.keywords;
      // 如果用户已登录，则把搜索记录存储到线上
      if (this.user) {
        this.searchHistory = this.userHistory;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>