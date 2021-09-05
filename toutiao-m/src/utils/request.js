// 网络请求模块

// // 引入axios
// import axios from 'axios'
// import jsonBig from 'json-bigint'

// //引入vuex，获取用户状态token
// import store from '@/store'

// const request = axios.create({
//   baseURL: '/api' //基础路径
//   // baseURL: 'http://ttapi.research.itcast.cn',
// });

// /**
//  * 配置处理后端返回数据中超出 js 安全整数范围问题
//  */
// request.defaults.transformResponse = [function (data) {
//   try {
//     return jsonBig.parse(data)
//   } catch (err) {
//     return {}
//   }
// }]

// // 请求拦截器 设置token
// request.interceptors.request.use(function (config) {
//   // console.log(config);
//   //获取用户token
//   const { user } = store.state
//   //如果用户已经登录，统一给接口设置token 信息
//   if (user) {
//     //config是本次请求的相关数据
//     config.headers.Authorization = `Bearer ${user.token}`
//   }
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })
// //响应拦截器

// //导出
// export default request


// ------------------------
/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'
import router from '@/router'
import { Notify } from 'vant'
import { Toast } from 'vant'

const refreshTokenReq = axios.create({
  baseURL: '/api'
})

// axios.create 方法：复制一个 axios
const request = axios.create({
  baseURL: '/api'
  // baseURL: 'http://ttapi.research.itcast.cn/'
  // baseURL: process.env.NODE_ENV === 'production'
  //   ? 'http://api-toutiao-web.itheima.net'
  //   : 'http://ttapi.research.itcast.cn/'
})

/**
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
request.defaults.transformResponse = [function (data) {
  try {
    return jsonBig.parse(data)
  } catch (err) {

    console.log('转换失败', err);

  }
}]

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = store.state.user
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)


// 响应拦截器
request.interceptors.response.use(function (response) {
  // 响应成功
  // 对响应数据做点什么

  return response;
}, async function (error) {

  // 响应失败

  // 对响应错误做点什么

  const status = error.response.status
  if (status === 401) {
    // token无效

    // 如果没有 user 或 user.token，直接去登录
    const { user } = store.state
    if (!user && !user.token) {

      // 直接跳转到登录页
      return redirectLogin()
    }

    // 如果有refresh——token，则请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer${user.refresh_token}`
        }
      })
      // 刷新token成功，拿到新token放到容器当中
      user.token = data.data.token
      store.commit('setUser', user)

      // 把失败的请求重新发送出去
      return request(error.config)
    } catch (err) {
      // 刷新token失败，直接跳转登录页
      redirectLogin()
    }
    // 拿到新的token后更新到容器中
    // 发失败的请求重新发出去
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  }
  else if (status === 400) {
    // 客户端参数错误
    Toast.fail('客户端请求参数异常')
  }
  else if (status >= 500) {
    // 服务器异常
    Toast.fail('服务端异常请稍后重试')
  }
  return Promise.reject(error);
});

// 跳转到登录页的方法
function redirectLogin() {
  router.replace('/login')
}

export default request
