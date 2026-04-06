<template>
  <view class="container">

    <view class="nav-bar">
      <text>标题</text>
    </view>

    <!-- 输入框 -->
    <view class="code-box">
      <view
        v-for="(item, index) in codeList"
        :key="index"
        :class="['code-item', { active: currentIndex === index }]"
        @click="setFocus(index)"
      >
        <text v-if="item && item !== ' '" :class="{ heart: item === '♡' }">
          {{ item }}
        </text>

        <view v-if="item === ' '" class="space-line"></view>

        <view
          v-if="currentIndex === index && !item"
          class="cursor"
        ></view>
      </view>
    </view>

    <!-- 键盘 -->
    <view class="keyboard">

      <view class="row">
        <view v-for="k in row1" :key="k" class="key" @click="handleInput(k)">
          <text>{{ k }}</text>
        </view>
      </view>

      <view class="row">
        <view v-for="k in row2" :key="k" class="key" @click="handleInput(k)">
          <text>{{ k }}</text>
        </view>
      </view>

      <view class="row">
        <view v-for="k in row3" :key="k" class="key" @click="handleInput(k)">
          <text>{{ k }}</text>
        </view>
      </view>

      <view class="row">
        <view v-for="k in row4" :key="k" class="key" @click="handleInput(k)">
          <text>{{ k }}</text>
        </view>
      </view>

      <view class="row">
        <view
          v-for="k in row5"
          :key="k.value"
          :class="['key', k.type]"
          @click="handleSpecial(k)"
        >
          <text v-if="k.type === 'normal'">{{ k.value }}</text>

          <!-- ❤️ 修复 -->
          <text v-if="k.type === 'heart'" class="heart">♡</text>

          <view v-if="k.type === 'space'" class="space-key">
            <view class="space-line"></view>
          </view>

          <text v-if="k.type === 'delete'">⌫</text>
        </view>
      </view>

    </view>

  </view>
</template>

<script setup>
import { ref } from 'vue'

const codeList = ref(['', '', '', '', ''])
const currentIndex = ref(0)

const row1 = ['1','2','3','4','5','6','7','8','9','0']
const row2 = ['A','B','C','D','E','F','G','H','I']
const row3 = ['J','K','L','M','N','O','P','Q','R']
const row4 = ['S','T','U','V','W','X','Y','Z','+']

const row5 = 
  [{ value: '-', type: 'normal' },
  { value: '/', type: 'normal' },
  { value: '?', type: 'normal' },
  { value: '!', type: 'normal' },
  { value: '@', type: 'normal' },
  { value: ':', type: 'normal' },
  { value: '♡', type: 'heart' }, // ✅ 改这里
  { value: ' ', type: 'space' },
  { value: 'del', type: 'delete' }
]
const vibrate = () => {
  uni.vibrateShort({ type: 'light' })
}

const handleInput = (val) => {
  vibrate()

  if (currentIndex.value >= codeList.value.length) {
    codeList.value[codeList.value.length - 1] = val
    return
  }

  codeList.value[currentIndex.value] = val

  if (currentIndex.value < codeList.value.length - 1) {
    currentIndex.value++
  }
}

const handleSpecial = (k) => {
  vibrate()

  if (k.type === 'delete') {
    if (codeList.value[currentIndex.value]) {
      codeList.value[currentIndex.value] = ''
      return
    }

    if (currentIndex.value > 0) {
      currentIndex.value--
      codeList.value[currentIndex.value] = ''
    }
    return
  }

  handleInput(k.value)
}

const setFocus = (i) => {
  currentIndex.value = i
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.nav-bar {
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.code-box {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
}

.code-item {
  width: 90rpx;
  height: 90rpx;
  border: 2rpx solid #aaa;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.code-item.active {
  border-color: #000;
}

.heart {
  color: #000;
  font-weight: bold;
}

/* 空格线（永远显示） */
.space-line {
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2rpx;
  background: #bbb;
  border-radius: 2rpx;
  z-index: 2;
}

/* 光标 */
.cursor {
  width: 2rpx;
  height: 50%;
  background: #999;
  animation: blink 1.5s infinite;
  z-index: 1;
}

@keyframes blink {
  50% { opacity: 0; }
}

.keyboard {
  margin-top: auto;
  padding: 10rpx 8rpx 20rpx;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6rpx;
}

.key {
  flex: 1;
  height: 70rpx;
  margin: 0 4rpx;
  border: 2rpx solid #555;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10rpx;
  background: #fff;
  transition: all 0.08s;
}

.key:active {
  transform: scale(0.88);
  background: #e5e5e5;
}

.space {
  flex: 2;
}

.delete {
  flex: 1.5;
  background: #eee;
}
</style>