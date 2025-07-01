import type { AddressParams } from '@/types/address'
import type { AddressItem } from '@/types/address'
import { http } from '@/utils/http'

/**
 * 新增收货地址
 * POST /member/address
 * @param data - 收货地址信息
 */
export const postMemberAddressAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: '/member/address',
    data,
  })
}
/**
 * 获取收货地址列表
 */
export const getMemberAddressAPI = () => {
  return http<AddressItem[]>({
    method: 'GET',
    url: '/member/address',
  })
}
