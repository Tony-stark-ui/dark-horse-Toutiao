//用户相关的请求模块

//引入网络请求模块
import request from '../utils/request'

//引入vuex 
//在非组件模块中获取store必须通过这种方式 单独加载
import store from '@/store'

//登陆注册
export function login(data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

//获取手机验证码
export function sendSms(mobile) {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

//获取登录用户的信息
export function getCurrentUser(token) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user',
    //设置请求头
    // headers: {  //Bearer 格式 后面空格跟用户token
    //   // Authorization: `Bearer ${store.state.user.token}`
    //   Authorization: `Bearer ${token}`
    // }  通过拦截器添加
  })
}

//获取用户频道列表
export function getUserChannels() {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注用户
export const deleteFollow = userId => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 编辑用户个人资料
export const editProfile = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}

// 更改头像
export const editPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}