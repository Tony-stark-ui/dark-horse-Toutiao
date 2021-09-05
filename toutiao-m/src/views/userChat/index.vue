<template>
  <div class="UserChat">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="小思同学"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    />
    <!-- 消息列表 -->

    <van-cell-group class="messageList">
      <van-cell
        :title="item.msg"
        v-for="(item, index) in messages"
        :key="index"
      />
    </van-cell-group>

    <!-- 底部发送消息 -->

    <van-cell-group class="send-message-wrap"
      ><van-field v-model="message" placeholder="请输入消息" :border="false" />
      <van-button class="send-btn" size="small" @click="onSend"
        >发送</van-button
      ></van-cell-group
    >
  </div>
</template>

<script>
// 引入聊天插件
import io from "socket.io-client";

export default {
  name: "UserChat",

  components: {},

  directives: {},

  data() {
    return {
      message: "",
      socket: null, //websocket通讯对象
      messages: [], //消息列表
    };
  },
  created() {
    // 建立连接
    const socket = io("/socket.io");
    this.socket = socket;
    socket.on("connect", function () {
      console.log("链接建立成功了");
    });
    //  socket.on('event',function(data) {

    //  });
    socket.on("disconnect", () => {
      console.log("断开连接了");
    });

    socket.on("message", (data) => {
      //  把对方发给我的消息放到数组中
      this.messages.push(data);
    });
  },
  mounted() {},

  methods: {
    // 发送消息
    onSend() {
      const data = {
        msg: this.message,
        timestamp: Date.now(),
      };
      this.socket.emit("message", data);
      // 把用户发出去的消息存储到数组中
      this.messages.push(data);
      this.message = "";
    },
  },
};
</script>

<style lang="less" scoped>
.send-message-wrap {
  display: flex;
  padding: 0 10px;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  .send-btn {
    width: 60px;
    background-color: rgb(104, 175, 104);
    color: #fff;
  }
}
.messageList {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
</style>