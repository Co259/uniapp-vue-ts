<script setup lang="ts">
import type { InputNumberBoxEvent } from '@/components/vk-data-input-number-box/vk-data-input-number-box'
import {
  deleteMemberCartAPI,
  getMemberCartAPI,
  putMemberCartSelectedAPI,
  putMemberCartSkuIdAPI,
} from '@/services/cart'
import { useMemberStore } from '@/stores'
import type { CartItem } from '@/types/cart'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, onDeactivated, ref } from 'vue'

// 获取会员购物车数据
const memberStore = useMemberStore()
const cartList = ref<CartItem[]>([])
const getMemberCartData = async () => {
  const res = await getMemberCartAPI()
  cartList.value = res.result
}
//删除购物车
const onDeleteCart = (skuId: string) => {
  uni.showModal({
    content: '是否删除',
    success: async (res) => {
      if (res.confirm) {
        // 删除
        await deleteMemberCartAPI({ ids: [skuId] })
        // 重新获取数据
        getMemberCartData()
      }
    },
  })
}
// 修改购物车数量
const onChangeCount = (ev: InputNumberBoxEvent) => {
  putMemberCartSkuIdAPI(ev.index, { count: ev.value })
}
//修改选中状态
const onChangeSelected = (item: CartItem) => {
  // 修改选中状态
  item.selected = !item.selected
  //后端数据更新
  putMemberCartSkuIdAPI(item.skuId, { selected: item.selected })
}
//计算全选状态
const isSelectedAll = computed(() => {
  return cartList.value.length && cartList.value.every((item) => item.selected)
})
//改变全选状态
const onChangeSelectedAll = () => {
  const _isSelectedAll = !isSelectedAll.value
  cartList.value.forEach((item) => {
    item.selected = _isSelectedAll
  })
  putMemberCartSelectedAPI({ selected: _isSelectedAll })
}
//选中单品列表
const selectedCartList = computed(() => {
  return cartList.value.filter((item) => item.selected)
})
//计算选中总件数
const selectedCartListCount = computed(() => {
  return selectedCartList.value.reduce((total, item) => total + item.count, 0)
})
//计算选中总价格
const selectedCartListMoney = computed(() => {
  return selectedCartList.value
    .reduce((total, item) => total + item.nowPrice * item.count, 0)
    .toFixed(2)
})
//付款按钮
const gotoPayment = () => {
  if (selectedCartListCount.value === 0) {
    return uni.showToast({ title: '请选择商品', icon: 'none' })
  }
  // 跳转到结算页面
  uni.showToast({ title: '正在跳转', icon: 'none' })
}
onShow(() => {
  if (memberStore.profile) {
    getMemberCartData()
  }
})
</script>

<template>
  <scroll-view scroll-y class="scroll-view">
    <!-- 已登录: 显示购物车 -->
    <template v-if="memberStore.profile">
      <!-- 购物车列表 -->
      <view class="cart-list" v-if="cartList.length">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        <!-- 滑动操作分区 -->
        <uni-swipe-action>
          <!-- 滑动操作项 -->
          <uni-swipe-action-item v-for="item in cartList" :key="item.skuId" class="cart-swipe">
            <!-- 商品信息 -->
            <view class="goods">
              <!-- 选中状态 -->
              <text
                @tap="onChangeSelected(item)"
                class="checkbox"
                :class="{ checked: item.selected }"
              ></text>
              <navigator
                :url="`/pages/goods/goods?id=${item.id}`"
                hover-class="none"
                class="navigator"
              >
                <image mode="aspectFill" class="picture" :src="item.picture"></image>
                <view class="meta">
                  <view class="name ellipsis">{{ item.name }}</view>
                  <view class="attrsText ellipsis">{{ item.attrsText }}</view>
                  <view class="price">{{ item.nowPrice }}</view>
                </view>
              </navigator>
              <!-- 商品数量 -->
              <view class="count">
                <vk-data-input-number-box
                  v-model="item.count"
                  :min="1"
                  :max="item.stock"
                  :index="item.skuId"
                  @change="onChangeCount"
                />
              </view>
            </view>
            <!-- 右侧删除按钮 -->
            <template #right>
              <view class="cart-swipe-right">
                <button class="button delete-button" @tap="onDeleteCart(item.skuId)">删除</button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <image src="/static/images/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator open-type="switchTab" url="/pages/index/index" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>
      <!-- 吸底工具栏 -->
      <view class="toolbar">
        <text @tap="onChangeSelectedAll" class="all" :class="{ checked: isSelectedAll }">全选</text>
        <text class="text">合计:</text>
        <text class="amount">{{ selectedCartListMoney }}</text>
        <view class="button-grounp">
          <view
            @tap="gotoPayment"
            class="button payment-button"
            :class="{ disabled: selectedCartListCount === 0 }"
          >
            去结算({{ selectedCartListCount }})
          </view>
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef"></XtxGuess>
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height"></view>
  </scroll-view>
</template>

<style lang="scss">
// 根元素
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
}

// 购物车列表
.cart-list {
  padding: 0 20rpx;

  // 优惠提示
  .tips {
    display: flex;
    align-items: center;
    line-height: 1;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    color: #666;

    .label {
      color: #fff;
      padding: 7rpx 15rpx 5rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      background-color: #27ba9b;
      margin-right: 10rpx;
    }
  }

  // 购物车商品
  .goods {
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;

    .navigator {
      display: flex;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;

      &::before {
        content: '\e6cd';
        font-family: 'erabbit' !important;
        font-size: 40rpx;
        color: #444;
      }

      &.checked::before {
        content: '\e6cc';
        color: #27ba9b;
      }
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrsText {
      line-height: 1.8;
      padding: 0 15rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      line-height: 1;
      font-size: 26rpx;
      color: #444;
      margin-bottom: 2rpx;
      color: #cf4444;

      &::before {
        content: '￥';
        font-size: 80%;
      }
    }

    // 商品数量
    .count {
      position: absolute;
      bottom: 20rpx;
      right: 5rpx;

      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 220rpx;
      height: 48rpx;

      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444;
      }

      .input {
        height: 100%;
        text-align: center;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #444;
        background-color: #f6f6f6;
      }
    }
  }

  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }

  .cart-swipe-right {
    display: flex;
    height: 100%;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 0;
    }

    .delete-button {
      background-color: #cf4444;
    }
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  .image {
    width: 400rpx;
    height: 281rpx;
  }
  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }
  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: #27ba9b;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .all {
    margin-left: 25rpx;
    font-size: 14px;
    color: #444;
    display: flex;
    align-items: center;
  }

  .all::before {
    font-family: 'erabbit' !important;
    content: '\e6cd';
    font-size: 40rpx;
    margin-right: 8rpx;
  }

  .checked::before {
    content: '\e6cc';
    color: #27ba9b;
  }

  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    color: #444;
    font-size: 14px;
  }

  .amount {
    font-size: 20px;
    color: #cf4444;

    .decimal {
      font-size: 12px;
    }

    &::before {
      content: '￥';
      font-size: 12px;
    }
  }

  .button-grounp {
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 72rpx;
    font-size: 13px;
    color: #fff;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: #27ba9b;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}
// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>
