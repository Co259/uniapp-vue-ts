import type { AddressItem } from '@/types/address'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemberAddress = defineStore(
  'member-address',
  () => {
    // 收货地址列表
    const addressList = ref<AddressItem[]>([])

    // 保存收货地址列表
    const setAddress = (val: AddressItem[]) => {
      addressList.value = val
    }

    // 清除收货地址
    const clearProfile = () => {
      addressList.value = []
    }
    return { addressList, setAddress, clearProfile }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)
