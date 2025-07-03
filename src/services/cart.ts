import type { CartItem } from '@/types/cart'
import { http } from '@/utils/http'

/**
 * 加入购物车
 * @param data 请求体参数
 */
export const postMemberCartAPI = (data: { skuId: string; count: number }) => {
  return http({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}
/**
 * 获取购物车列表
 */
export const getMemberCartAPI = () => {
  return http<CartItem[]>({
    method: 'GET',
    url: '/member/cart',
  })
}
/**
 * 删除购物车单品/清空
 * @param data 请求体参数 ids SKUID集合
 */
export const deleteMemberCartAPI = (data: { ids: string[] }) => {
  return http({
    method: 'DELETE',
    url: '/member/cart',
    data,
  })
}
/**
 * 修改购物车单品
 * @param data 请求体参数 selected 选中状态 count 数量
 * @param skuID SkuID
 */
export const putMemberCartSkuIdAPI = (
  skuID: string,
  data: { selected?: boolean; count?: number },
) => {
  return http({
    method: 'PUT',
    url: `/member/cart/${skuID}`,
    data,
  })
}
