<template>
  <div class="qa">
    <h1>问答</h1>
    <van-tabs v-model="activeName">
      <van-tab title="标签 1" name="a">内容 1</van-tab>
      <van-tab title="标签 2" name="b">内容 2</van-tab>
      <van-tab title="标签 3" name="c">内容 3</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "qa",

  components: {},

  directives: {},

  data() {
    return {
      activeName: "b",
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.l&:last-child {
  color: red;
}
</style>