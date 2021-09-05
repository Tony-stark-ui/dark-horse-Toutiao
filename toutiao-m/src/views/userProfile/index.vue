<template>
  <div class="user-profile">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="个人信息"
      class="app-nav-bar"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <!-- 个人信息 -->
    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    />
    <van-cell title="头像" is-link center>
      <van-image
        round
        width="30"
        height="30"
        :src="user.photo"
        @click="$refs.file.click()"
      />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="showPopup"
    ></van-cell>
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 1 ? '男' : '女'"
      @click="showGenderPopup"
    ></van-cell>
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="showBirthdayPopup"
    ></van-cell>

    <!-- 修改昵称页面弹出层 -->
    <van-popup
      v-model:show="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-name
        v-if="isEditNameShow"
        @close="isEditNameShow = false"
        @onClickLeft="onClickLeft"
        :name="user.name"
      ></update-name>
    </van-popup>

    <!-- 修改性别的弹出层 -->
    <van-popup v-model:show="isEditgenderShow" position="bottom">
      <update-gender
        :gender="user.gender"
        @close="isEditgenderShow = false"
        @onEditGender="onEditGender"
      ></update-gender>
    </van-popup>

    <!-- 修改生日的弹出层 -->
    <van-popup v-model:show="isBirthdayShow" position="bottom">
      <update-birthday
        v-if="isBirthdayShow"
        v-model:value="user.birthday"
        @close="isBirthdayShow = false"
        @editBirthday="editBirthday"
      ></update-birthday>
    </van-popup>

    <!-- 修改用户头像弹出层 -->
    <van-popup
      class="photo-popup"
      v-model:show="isPhotoShow"
      style="height: 100%"
      position="bottom"
    >
      <update-photo
        v-if="isPhotoShow"
        :file="previewImage"
        @close="isPhotoShow = false"
        @updatePhoto="updatePhoto"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
// 引入获取用户个人资料的请求方法
import { getUserProfile } from "@/network/user";

// 引入修改昵称页面组件
import UpdateName from "./childComps/UpdateName.vue";

// 引入修改性别组件
import UpdateGender from "./childComps/UpdateGender.vue";

// 引入修改生日组件
import UpdateBirthday from "./childComps/UpdateBirthday.vue";

// 引入修改头像组件
import UpdatePhoto from "./childComps/UpdatePhoto.vue";

export default {
  name: "user-profile",

  components: {
    UpdateName, //修改昵称组件
    UpdateGender, //修改性别组间
    UpdateBirthday, //修改性别组件
    UpdatePhoto, //修改头像组件
  },

  directives: {},

  data() {
    return {
      user: {}, //用户数据
      isEditNameShow: false, //修改昵称弹出层状态
      isEditgenderShow: false, //修改性别弹出层状态
      isBirthdayShow: false, //修改生日弹出层状态
      isPhotoShow: false, //修改头像弹出层状态
      previewImage: null, //上传预览图片
    };
  },
  created() {
    // 获取用户数据
    this.loadUserProfile();
  },
  mounted() {},

  methods: {
    // 获取用户数据
    async loadUserProfile() {
      const { data } = await getUserProfile();
      this.user = data.data;
    },
    // 控制修改昵称弹出层状态
    showPopup() {
      this.isEditNameShow = true;
    },
    // 修改性别弹出层呢个状态
    showGenderPopup() {
      this.isEditgenderShow = true;
    },
    // 修改昵称完成按钮点击事件
    onClickLeft(newName) {
      this.isEditNameShow = false;
      this.user.name = newName;
    },
    //修改性别点击完成事件
    onEditGender(gender) {
      this.isEditgenderShow = false;
      this.user.gender = gender;
    },
    // 修改生日弹出层
    showBirthdayPopup() {
      this.isBirthdayShow = true;
    },
    // 修改生日
    editBirthday(date) {
      this.isBirthdayShow = false;
      this.user.birthday = date;
    },
    // 选择文件发生改变时触发
    onFileChange() {
      // 选择完图片打开弹出层预览图片
      this.isPhotoShow = true;
      // 在弹出层里面预览选中的图片
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0]);
      const file = this.$refs.file.files[0];
      this.previewImage = file;
      // 为了解决相同文件不触发change事件，所以在这里手动清空选过的文件
      this.$refs.file.value = "";
    },
    updatePhoto(img) {
      this.isPhotoShow = false;
      this.user.photo = img;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-popup {
  background-color: #f5f7f9;
}
/deep/ .photo-popup {
  background-color: #000;
}
</style>