import type { LoginResult } from '@/types/merber'
import { http } from '@/utils/http'

type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}
/**
 * 小程序登陆
 * @param data 登录参数
 */
export const postLoginWxMinAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data,
  })
}
/**
 * 小程序内测登陆
 * @param phoneNumber 模拟手机号码
 */
export const postLoginWxMinsimpleAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin',
    data: {
      phoneNumber,
    },
  })
}
