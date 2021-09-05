<template>
  <div>
    <van-cell-group>
      <van-cell
        class="articleItem"
        :to="{
          name: 'article',
          params: {
            articleId: article.art_id,
          },
        }"
      >
        <!-- 文章标题 -->
        <template #title>
          <div class="title van-multi-ellipsis--l3">{{ article.title }}</div>
        </template>

        <!-- 文章作者、评论、发布时间 -->
        <template #label>
          <!-- 三张图片的封面 -->
          <div class="cover-wrap" v-if="article.cover.type == 3">
            <div
              class="cover-wrap-item"
              v-for="(item, index) in article.cover.images"
              :key="index"
            >
              <van-image class="bottomCover" fit="cover" :src="item" />
            </div>
          </div>
          <div class="label-wrap">
            <span>{{ article.aut_name }}</span>
            <span>{{ article.comm_count }}评论</span>
            <span>{{ time }}</span>
          </div>
        </template>

        <!-- 文章右侧图片 -->
        <template #value>
          <!-- 一张图片的封面 -->
          <van-image
            v-if="article.cover.type == 1"
            fit="cover"
            :src="article.cover.images[0]"
            class="rightCover"
          />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { time } from "../../../utils/dayjs";
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {};
  },

  mounted() {},

  methods: {},
  computed: {
    time() {
      return time(this.article.pubdate);
    },
  },
};
</script>

<style lang="less" scoped>
.articleItem {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__value {
    flex: unset;
    margin-left: 12px;
  }
  .rightCover {
    width: 116px;
    height: 73px;
  }
  .cover-wrap {
    display: flex;
    flex-wrap: nowrap;
    padding: 15px 0;
    .cover-wrap-item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .bottomCover {
        width: 100%;
        height: 100%;
      }
    }
  }
  .label-wrap {
    padding-top: 5px;
    span {
      margin-right: 8px;
    }
  }
}
</style>