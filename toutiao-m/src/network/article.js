//文章请求相关模块

//引入网络请求模块
import request from '../utils/request'

//请求文章列表
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}

//文章详情
export const getArticleById = (articleId) => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const getCollected = (articleId) => {
  return request({

    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target: articleId
    }

  })
}
// 取消收藏
export const deleteCollected = (articleId) => {
  return request({

    method: 'DELETE',
    url: `/app/v1_0/article/collections/${articleId}`
  })
}

// 点赞
export const addAttitude = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: userId
    }
  })
}
// 取消点赞
export const deleteAttitude = userId => {
  return request({
    method: 'delete',
    url: `/app/v1_0/article/likings/${userId}`
  })
}
