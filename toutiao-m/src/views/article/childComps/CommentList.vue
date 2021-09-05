<template>
  <div class="commentList">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @replyClick="$emit('replyClick', $event)"
      ></comment-item>
    </van-list>
  </div>
</template>

<script>
// 引入评论项
import CommentItem from "./CommentItem.vue";

// 引入评论数据请求方法
import { getComments } from "@/network/comment";
export default {
  name: "Commentlist",
  props: {
    source: {
      type: Number || String || Object,
      required: true,
    },
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    type: {
      type: String,
      default: "a",
    },
  },

  components: {
    CommentItem, //评论项
  },

  directives: {},

  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, //获取下一页数据的页码
      limit: 10, //每一页十条数据
    };
  },
  methods: {
    async onLoad() {
      //获取数据
      const { data } = await getComments({
        type: this.type, //评论类型，对文章评论传a，对评论回复传c
        source: this.source.toString(), //文章id或评论id
        offset: this.offset, //评论页码
        limit: this.limit, //每一页的大小
      });
      this.$emit("updateTotalCount", data.data.total_count);
      // 把数据放到list中
      console.log(data);
      const { results } = data.data;
      this.list.push(...results);
      // 将本次loading关闭
      this.loading = false;
      //判断是否还有数据，如果有更新数据，没有就不再触发加载更多
      if (results.length) {
        // 如果有获取下一页数据的id
        this.offset = data.data.last_id;
      } else {
        // 没有就显示没有更多数据了
        this.finished = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.commentList {
  background-color: #fff;
}
</style>