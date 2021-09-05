
// 导入插件datejs
import dayjs from 'dayjs'

import relativeTime from 'dayjs/plugin/relativeTime'// 按需加载插件
//导入语言包
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn') // 全局使用简体中文
dayjs.extend(relativeTime)// 使用插件

const time = (value) => {
  return dayjs(value).from(dayjs())
}
const datatime = (value) => {
  return dayjs(value).from(dayjs())
}
export {
  time, datatime
}


