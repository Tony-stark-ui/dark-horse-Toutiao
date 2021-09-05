<template>
  <div class="Searchresult">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
// 引入搜索结果请求方法
import { getSearchResult } from "@/network/search";

export default {
  name: "Searchresult",
  props: {
    // 输入框内容
    searchText: {
      type: String,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      list: [], //数据列表
      loading: false,
      finished: false,
      page: 1, //页码,
      per_page: 10, //每页的数据数量
    };
  },

  mounted() {},

  methods: {
    async onLoad() {
      //请求获取数据
      const { data } = await getSearchResult({
        page: this.page, //页码
        per_page: this.per_page, //每页的数据数量
        q: this.searchText, //搜索字符
      });
      //将数据放到数据列表中
      const { results } = data.data;
      this.list.push(...results);
      //关闭本次的loading
      this.loading = false;
      //判断是否还有数据，如果有更新获取下一页数据，没有就关闭加载更多
      if (results.length) {
        //如果有，则更新获取下一页的数据
        this.page++;
      } else {
        //没有数据
        this.finished = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.van-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
}
</style>