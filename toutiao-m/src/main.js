import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'default-passive-events'

// 引入vant组件库
import Vant from 'vant';
//引入样式
import 'vant/lib/index.css';
// 引入rem适配插件
import 'amfe-flexible'

//引入提出框插件
import { Dialog } from 'vant';


// 加载全局样式
import './styles/index.less'

createApp(App).use(store).use(router).use(Vant).use(Dialog).mount('#app')
