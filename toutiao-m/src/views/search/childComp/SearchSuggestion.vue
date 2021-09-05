<template>
  <div class="searchSuggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', item)"
    >
      <template #title>
        <div v-html="height(item)"></div>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 引入联想建议请求方法
import { getSugestions } from "@/network/search";

//引入lodash第三方工具函数中的防抖方法
import { debounce } from "lodash";

export default {
  name: "Searchsuggestion",
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
      suggestions: [], //联想建议数据列表
    };
  },
  //监听输入框发生变化，发送请求
  watch: {
    //属性名：要监视的数据的名称 这种写法第一次监视不到数据
    // searchText() {  浅度监听
    //   console.log(66);
    // },
    // 完整写法
    searchText: {
      //防抖函数
      handler: debounce(async function () {
        //请求获取数据
        const { data } = await getSugestions(this.searchText);
        //模板绑定展示
        let options = data.data.options;
        this.suggestions = options;
      }, 200),
      // 初始化的时候直接执行一次 深度监听
      immediate: true, //该回调将会在侦听开始之后被立即调用
    },
  },

  mounted() {},

  methods: {
    //替换联想关键词高亮的方法
    height(str) {
      // 正则表达式的构造函数 RegExp
      //参数1,：字符串，参数2：匹配模式，返回值：正则对象
      return str.replace(
        new RegExp(this.searchText, "gi"),
        `<span style="color:red">${this.searchText}</span>`
      );
      // return str.replaceAll(
      //   this.searchText,
      //   `<span style="color:red">${this.searchText}</span>`
      // );
    },
  },
};
</script>

<style lang="less" scoped>
.searchSuggestion {
  background-color: #fff;
}
</style>