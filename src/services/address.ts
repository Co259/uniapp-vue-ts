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
/**
 * 获取收货地址详情
 * GET /member/address/:id
 * @param id - 收货地址id
 */
export const getMemberAddressbyIdAPI = (id: string) => {
  return http<AddressItem>({
    method: 'GET',
    url: `/member/address/${id}`,
  })
}
/**
 * 修改收货地址
 * PUT /member/address/{id}
 * @param id - 收货地址id
 */
export const putMemberAddressbyIdAPI = (id: string, data: AddressParams) => {
  return http({
    method: 'PUT',
    url: `/member/address/${id}`,
    data,
  })
}
/**
 * 删除收货地址
 * DELETE /member/address/{id}
 * @param id - 收货地址id
 */
export const deleteMemberAddressbyIdAPI = (id: string) => {
  return http({
    method: 'DELETE',
    url: `/member/address/${id}`,
  })
}
