<template>
  <div class="Searchhistory">
    <van-cell title="历史记录">
      <div v-if="isDeleteShow">
        <span @click="$emit('updateHistories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else @click="isDeleteShow = true" name="delete-o" />
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistory"
      :key="index"
      :title="item"
      @click="isDeleteShow ? '' : $emit('search', item)"
    >
      <van-icon
        v-show="isDeleteShow"
        name="close"
        @click.native.stop="onDelete(index)"
      />
    </van-cell>
  </div>
</template>

<script>
import { setItem } from "@/utils/storage";
export default {
  name: "Searchhistory",
  // 搜索历史数据
  props: {
    searchHistory: {
      type: Array,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      isDeleteShow: false, //删除的显示状态
    };
  },

  mounted() {},

  methods: {
    //删除单个的事件
    onDelete(index) {
      // 删除
      this.searchHistory.splice(index, 1);
      // 持久化处理
      //1.修改本地存储
      // setItem('searchHistory',this.searchHistory)
      //2.请求接口删除数据
    },
  },
};
</script>

<style lang="less" scoped>
</style>