//搜索页面网络请求模块
// 引入封装的axios
import request from '../utils/request'

//联想建议
export const getSugestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q //查询搜索关键词
    }
  })
}

//搜索结果
export const getSearchResult = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}

//获取搜索历史
export const getHistories = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories',

  })
}