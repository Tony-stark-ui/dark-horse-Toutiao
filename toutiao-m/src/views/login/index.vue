<template>
  <div class="login-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="登录/注册"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      class="app-nav-bar"
    />
    <!-- 登录表单组件 -->
    <!-- 基于vant的表单验证 -->
    <van-form @submit="onLogin" ref="loginForm">
      <!-- 手机号 -->
      <van-field
        center
        v-model="user.mobile"
        icon-prefix="icon"
        left-icon="shouji"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
        name="phoneNumber"
      />
      <!-- 验证码 -->
      <van-field
        center
        v-model="user.code"
        clearable
        icon-prefix="icon"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <!-- 按钮 -->
        <template #button>
          <van-count-down
            :time="60000"
            format=" ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            size="mini"
            class="send-btn"
            round
            @click.prevent="onSendSms"
            v-else
            :loading="isSendSmsLoading"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div class="login">
        <van-button
          native-type="submit"
          class="login-btn"
          type="info"
          block
          color="#0E85FF"
          >登录/注册</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
//引入用户信息请求方法
import { login, sendSms } from "../../network/user";
export default {
  name: "login",

  components: {},

  directives: {},

  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "", //验证码
      },
      formRules: {
        //表单效验规则
        mobile: [
          { required: true, message: "手机号不能为空" },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: "手机号格式错误" },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^\d{6}$/, message: "验证码不正确" },
        ],
      },
      isCountDownShow: false, //控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false, //发送验证码按钮的状态
    };
  },

  mounted() {},

  methods: {
    // 返回箭头点击事件
    onClickLeft() {
      this.$router.back();
    },
    // 登录按钮点击事件
    onLogin() {
      this.$toast.loading({
        message: "登陆中...",
        forbidClick: true,
        duration: 0,
      });
      //找到数据接口
      //封装请求方法
      //请求调用登录
      login(this.user)
        .then((res) => {
          console.log(res);
          this.$toast.success("登陆成功");

          let { data } = res.data;
          //将服务器返回的token传递给vuex存储起来
          this.$store.dispatch("actionsSetUser", data);
          // 登录成功跳转到个人页面
          this.$router.back();
        })
        .catch((err) => {
          this.$toast.fail("登录失败，手机号或验证码错误");
        });
    },
    //点击发送验证码
    async onSendSms() {
      //效验手机号码有没有输入格式对不对
      try {
        //vant 中的方法效验单个表单
        await this.$refs.loginForm.validate("phoneNumber");

        // 验证通过按钮进入不可选中状态，防止网速不好请求发送过多
        this.isSendSmsLoading = true;

        //验证通过 => 请求发送验证码
        const res = await sendSms(this.user.mobile);
        console.log(res);

        //验证码发送成功，按钮进入倒计时
        this.isCountDownShow = true;

        //倒计时结束，隐藏倒计时按钮显示发送按钮
      } catch (err) {
        //try里面任何的错误都会进入catch，不同的错误有不同的提示，就要去判断了
        let message = "";
        if (err && err.response && err.response.status === 429) {
          // 短信发送频繁的错误提示
          message = "发送太频繁了，请稍后重试";
        } else if (err.name === "phoneNumber") {
          // 手机号验证失败错误提示
          message = err.message;
        } else {
          //未知错误
          message = "发送失败，请稍后重试";
        }
        this.$toast({ message: message, position: "top" });
        // this.$toast({ message: err.message, position: "top" });
      }

      // 无论发送成功还是失败，都要关闭发送按钮loading
      this.isSendSmsLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  padding: 26px 16px;
  .login-btn {
    background-color: hsl(210, 97%, 65%) !important;
    border: none;
    border-radius: 6px;
  }
}
.send-btn {
  background-color: #eee;
}
</style>