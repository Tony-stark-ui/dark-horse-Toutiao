<template>
  <div class="Channeledit">
    <!-- 频道编辑 -->
    <!-- 标题 我的频道 -->
    <van-cell center :border="false">
      <template #title>
        <div class="title">我的频道</div>
      </template>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <!-- 模块内容 -->
    <van-grid :gutter="10" class="Mychannel">
      <van-grid-item
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(item, index) in channel"
        :key="item.id"
        :text="item.name"
        @click="onUserChannelClick(index, item)"
        :class="{ active: index == active }"
        class="ChannelItem"
      />
    </van-grid>

    <!-- 标题 频道 推荐-->
    <van-cell center :border="false">
      <template #title> <div class="title">频道推荐</div> </template>
    </van-cell>
    <!-- 模块内容 -->
    <van-grid :gutter="10">
      <van-grid-item
        class="ChannelItem"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
//引入网络请求方法
//获取所用用户频道列表
import { getAllChannels, addChannel, deleteChannel } from "@/network/channels";

//引入vuex容器中存储的用户登录状态
import { mapState } from "vuex";

//引入封装的本地存储操作方法
import { setItem } from "@/utils/storage";

export default {
  name: "Channeledit",
  props: {
    channel: {
      type: Object,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },

  components: {},

  directives: {},

  data() {
    return {
      allChannels: [], //所有频道列表数据
      isEdit: false, //控制编辑删除的显示状态
    };
  },
  created() {
    //获取所有频道数据
    this.loadAllChannels();
  },
  mounted() {},
  computed: {
    ...mapState(["user"]), //将本地存储中的user用户登录状态映射到本地

    // 推荐频道信息
    recommendChannels() {
      //推荐频道信息 = 全部频道信息 - 我的频道信息
      return this.allChannels.filter((channels) => {
        //判断当前遍历的频道是否属于用户频道
        return !this.channel.find((userChannel) => {
          // 找到满足该条件的元素
          return userChannel.id == channels.id;
        });
      });
    },
  },

  methods: {
    //获取所用频道数据
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },
    // 添加推荐频道到我的频道的点击事件
    async onAdd(channel) {
      this.channel.push(channel); //这里只是做了添加事件没有做推荐频道的移除事件，但是推荐频道的点击项也跟着移除了，这是因为计算属性的值变化了她会重新计算，然后重新渲染
      //这个计算属性依赖的是allChannels和channel，这两个中其中一个发生变化他都会重新计算重新渲染

      // 数据持久化，如果用户没有登录将数据添加到本地存储，如果登陆了添加到服务器
      if (this.user) {
        //登陆了数据存储到线上
        await addChannel({
          id: channel.id,
          seq: this.channel.length,
        });
      } else {
        //没有登录存到本地存储
        setItem("userChannels", this.channel);
      }
    },
    //点击删除事件 逻辑写另外两个方法里面了
    onUserChannelClick(index, channel) {
      //如果是编辑状态就删除频道，如果不是就切换频道
      //推荐频道不能删除
      if (this.isEdit && index !== 0) {
        //编辑状态删除操作
        this.deleteChannel(index, channel);
      } else {
        //非编辑状态，切换操作
        this.switchChanel(index);
      }
    },
    //删除频道
    async deleteChannel(index, channel) {
      //如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        //更新激活频道的索引
        this.$emit("switchChanel", this.active - 1);
      }
      this.channel.splice(index, 1);

      // 数据持久化
      if (this.user) {
        //登陆了，持久化到线上
        await deleteChannel(channel.id);
      } else {
        //没有登录，持久化到本地
        setItem("userChannels", this.channel);
      }
    },
    //切换频道
    switchChanel(index) {
      //关闭弹出层 切换频道
      this.$emit("switchChanel", index);
    },
  },
};
</script>

<style lang="less" scoped>
.Channeledit {
  .Mychannel {
    margin-bottom: 30px;
  }
  .ChannelItem {
    position: relative;
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        margin-top: 0;
        font-size: 14px;
        color: #222;
      }
    }
  }
  padding-top: 55px;
  /deep/ .title {
    font-size: 16px;
    color: #333;
  }
  /deep/.van-icon {
    position: absolute;
    right: -5px;
    top: -5px;
    font-size: 18px;
    z-index: 2;
    color: #bbb;
  }
  .active {
    /deep/ .van-grid-item__text {
      color: #e5615b !important;
    }
  }
}
</style>