//本地存储模块

//获取本地存储
export const getItem = (name) => {

  const data = window.localStorage.getItem(name) //原始的本地存储数据，json字符串格式

  //因为data可能不是json字符串，如果是就try转换成功，如果不是try会报错catch抛出异常将data返回出去
  try {
    return JSON.parse(data) //尝试把数据转为js对象
  } catch (err) {
    return data //data不是json字符串，原样返回
  }

}

//存储
export const setItem = (name, value) => {
  //本地存储不能直接存js对象，要转换为json字符串,判断传进来的数据value是不是对象再进行下一步转换
  if (typeof value === 'object') {
    //数据类型检测如果是对象将value转换为字符串再进行存储
    value = JSON.stringify(value)
  }
  //判断失败与否都存进去，判断成功value已转为字符串，判断失败value不是对象就不会走if原样存储
  window.localStorage.setItem(name, value)
}


//删除
export const removeItem = (name) => {
  //直接根据传进来的name进行删除
  window.localStorage.removeItem(name)
}