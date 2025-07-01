<script setup lang="ts">
//
import CustomNavbar from './components/CustomNavbar.vue'
import { onLoad } from '@dcloudio/uni-app'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import Pageskeleton from './components/Pageskeleton.vue'
import { useGuessList } from '@/composables'
// 轮播图数据
const BannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  BannerList.value = res.result
  console.log(res)
}
// 分类数据
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}
// 推荐商品数据
const hotlist = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotlist.value = res.result
  console.log(res)
}
const isLoading = ref(false)
// 加载数据
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
  isLoading.value = false
})
//加载更多
const { guessRef, onScrolltolower } = useGuessList()
const isTrigger = ref(false)
const onRefresherrefresh = async () => {
  //开启刷新
  isTrigger.value = true
  // getHomeBannerData()
  // getHomeCategoryData()
  // getHomeHotData()
  guessRef.value?.resetData()
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
  guessRef.value?.getMore()
  //关闭刷新
  isTrigger.value = false
}
</script>

<template>
  <!-- 导航栏 -->
  <CustomNavbar />
  <scroll-view
    refresher-enabled
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="onScrolltolower"
    :refresher-triggered="isTrigger"
    class="scroll-view"
    scroll-y
  >
    <Pageskeleton v-if="isLoading" />
    <template v-else>
      <!-- 轮播图 -->
      <XtxSwiper :list="BannerList" />
      <!-- 分类 -->
      <CategoryPanel :list="categoryList" />
      <!-- 推荐商品 -->
      <HotPanel :list="hotlist" />
      <!-- 猜你喜欢 -->
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
