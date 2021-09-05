import { createRouter, createWebHashHistory } from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

// 路由表
const routes = [
  // 路由懒加载
  // 路由重定向
  // {
  //   path: '',
  //   redirect: '/'
  // },
  {
    path: '/login',
    component: () => import('@/views/login'),
    name: 'login',
    meta: { //添加格外的自定义数据
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: () => import('@/views/layout'),
    // 子路由
    children: [

      {
        path: '', // 首页 默认子路由
        component: () => import('@/views/home'),
        meta: { //添加格外的自定义数据
          requiresAuth: false
        }
      },
      {
        path: '/qa',
        component: () => import('@/views/qa'),
        meta: { //添加格外的自定义数据
          requiresAuth: false
        }
      },
      {
        path: '/frequency',
        component: () => import('@/views/frequency'),
        meta: { //添加格外的自定义数据
          requiresAuth: false
        }
      },
      {
        path: '/my',
        component: () => import('@/views/my'),
        meta: { //添加格外的自定义数据
          requiresAuth: false
        }
      },
    ]
  },
  {
    path: '/search',
    component: () => import('@/views/search'),
    meta: { //添加格外的自定义数据
      requiresAuth: false
    }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    meta: { //添加格外的自定义数据
      requiresAuth: false
    },
    props: true //通过props传递参数
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/userProfile'),
    meta: { //添加格外的自定义数据
      requiresAuth: false
    }
  },
  {
    path: '/user/chat',
    component: () => import('@/views/userChat'),
    meta: { //添加格外的自定义数据
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局导航守卫
// to：要访问的路由信息
// from：来自哪个页面的路由信息
// next：放行的标记
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (store.state.user) {
      //如果有token 已经登陆了就直接通过
      return next()
    } else {
      // 没有登录就提示登录

      Dialog.confirm({
        title: '访问提示',
        message: '该功能需要登录才能访问，确认登陆吗？',
      })
        .then(() => { //确认执行这里
          // on confirm
          next('/login')
        })
        .catch(() => { //取消执行这里
          //取消了停止路由导航
          next(false)
        });
    }

  } else {
    // 不需要登录的页面直接过去
    next()
  }
})

export default router
