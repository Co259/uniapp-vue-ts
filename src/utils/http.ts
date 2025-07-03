import { useMemberStore } from '@/stores'
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    // 判断当前请求的URL是否以https:开头
    if (!options.url.startsWith('https:')) {
      options.url = baseURL + options.url
    }
    //请求超时
    options.timeout = 10000
    // 添加请求头
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 添加token
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    return options
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)
// 泛型
interface Data<T> {
  code: string
  msg: string
  result: T
}
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({
            url: '/pages/login/login',
          })
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求失败',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络失败，换个网络试试吧',
        })
        reject(err)
      },
    })
  })
}
