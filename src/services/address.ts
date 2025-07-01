import type { AddressParams } from '@/types/address'
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
