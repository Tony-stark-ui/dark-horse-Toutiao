import { createStore } from 'vuex'

//导入封装好的本地存储数据的方法
import { getItem, setItem, removeItem } from '@/utils/storage'

//定义一个常量 代表本地存储和获取本地存储时的name名称，避免获取和存储名称不一致导致出问题
const USER_KEY = 'toutiao-user'

export default createStore({
  state: {
    //不能写null了，初始化时要从本地存储将数据读出来//
    //user: null,//当前登录用户的登录状态 token//
    //user: JSON.parse(window.localStorage.getItem('user')), //初始化时先从本地存储中读数据,数据转为js对象//
    //-------------------------------------------------//
    //简化版，通过封装的方法获取本地存储数据并转换数据格式\
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data

      //为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中，注意这里仅仅是为了持久化数据
      //window.localStorage.setItem('user', JSON.stringify(state.user)) //数据转为json字符串
      //--------------------------------//\
      //简化版往本地存储存数据
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
    //这里通过action异步传递参数会好一点
    actionsSetUser(context, data) {
      context.commit('setUser', data)
    }
  },
  modules: {
  }
})
