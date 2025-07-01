import type { ProfileDetail } from '@/types/merber'
import { http } from '@/utils/http'

/**
 * 获取个人信息
 * GET /member/proflie
 */
export const getMemberProfileAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/member/profile',
  })
}
