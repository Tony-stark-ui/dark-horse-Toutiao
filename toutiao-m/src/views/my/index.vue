
<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card" v-if="user">
      <!-- 用户头像、姓名 -->
      <van-cell :border="false">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="currentUser.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username"> {{ currentUser.name }} </span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff" @click="userProfile"
            >编辑资料</van-tag
          >
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ currentUser.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ currentUser.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ currentUser.fans_count }}</span>
          <span>粉丝</span>
        </div>
        <div class="user-data-item">
          <span>{{ currentUser.like_count }}</span>
          <span>获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录的 -->
    <div class="not-login" @click="$router.push('/login')" v-else>
      <div>
        <img class="mobile" src="./shouji.png" alt="" />
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <!-- 下面的收藏和历史 -->
    <van-grid class="nav-grid-item" :column-num="2">
      <van-grid-item icon-prefix="icon" icon="shoucang" text="收藏" />
      <van-grid-item icon-prefix="icon" icon="lishi" text="历史" />
    </van-grid>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="chat-o" title="消息通知" is-link />
      <van-cell
        icon="birthday-cake-o"
        title="小思同学"
        is-link
        to="/user/chat"
      />
    </van-cell-group>
    <!-- 退出登录 -->
    <van-button v-if="user" size="large" class="edit-btn" @click="onLogin"
      >退出</van-button
    >
  </div>
</template>
<script>
//引入vuex自带的方法拿数据
import { mapState } from "vuex";

//引入获取登录用户信息的请求方法
import { getCurrentUser } from "@/network/user";

export default {
  name: "my",

  computed: {
    //将mapState映射到组件当中,映射的是vuex的state中的属性
    //意思是将vuex这个容器里面的数据映射到这个组件里
    ...mapState(["user"]),
  },

  components: {},

  directives: {},

  data() {
    return {
      currentUser: {}, //用户信息
    };
  },
  created() {
    //获取登录用户信息
    this.loadCurrentUser();
  },

  mounted() {},

  methods: {
    // 退出事件
    onLogin() {
      //提示用户确认退出
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "确认退出吗？",
        })
        .then(() => {
          //点击确认后 执行这里
          //清楚用户登录状态  修改vuex中存储的用户的登录状态
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // 点击取消后 执行这里
        });
    },

    //获取登录用户信息
    async loadCurrentUser() {
      //通过store中user的值判断用户是否登录，登录的话调用请求方法，如果没登录user是null，直接调用会报错的
      if (this.$store.state.user) {
        let { token } = this.$store.state.user;
        const { data } = await getCurrentUser(token);
        this.currentUser = data.data;
      }
    },
    // 跳转到编辑资料页面
    userProfile() {
      this.$router.push("/user/profile");
    },
  },
};
</script>

<style lang="less" scoped>
.user-container {
  .user-card {
    background-color: #fff;
    background-image: url("./banner.png");
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #fff;
      background-image: url("./banner.png");
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}

.nav-grid-item {
  height: 70px;
  margin-bottom: 11px;

  /deep/.icon-shoucang {
    color: #eb5253;
  }
  /deep/.icon-lishi {
    color: #ff9d1d;
  }
}
.edit-btn {
  text-align: center;
  color: rgb(243, 19, 19);
  border: none;
  margin-top: 6px;
}
.not-login {
  height: 180px;
  background: url("./banner.png") no-repeat;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-size: cover;
  .mobile {
    width: 66px;
    height: 66px;
  }
  .text {
    color: #fff;
    font-size: 14px;
    margin-top: 7px;
  }
}
</style>