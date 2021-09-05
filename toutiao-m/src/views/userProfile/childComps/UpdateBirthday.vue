<template>
  <div class="Updatebirthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
// 引入网络请求方法，编辑资料
import { editProfile } from "@/network/user";

// 引入时间处理函数
import dayjs from "dayjs";

export default {
  name: "Updatebirthday",
  props: {
    value: {
      type: String,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      minDate: new Date(1980, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },

  mounted() {},

  methods: {
    // 点击确认
    async onConfirm() {
      // 请求提交更新用户生日
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, //禁止背景点击
      });
      const date = dayjs(this.currentDate).format("YYYY-MM-DD");
      //  请求提交更新用户昵称
      await editProfile({
        birthday: date,
      });
      // 更新成功：-》修改父组件的name -》 关闭弹出层
      this.$toast.success("保存成功");
      this.$emit("editBirthday", date);
      // 更新父组件中的用户生日

      // 关闭弹出层
    },
  },
};
</script>

<style lang="less" scoped>
</style>