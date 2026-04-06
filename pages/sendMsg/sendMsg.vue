<template>
  <view class="container">

    <TopBar></TopBar>

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

        <view v-if="item === ' '" class="input-space-line"></view>

        <view
          v-if="currentIndex === index && !item"
          class="cursor"
        ></view>
      </view>
    </view>
	
	<!-- 居中悬浮大按钮 -->
	    <view class="float-btn" @click="onSend" hover-class="btn-hover" hover-stay-time="100">
	      <uni-icons type="paperplane" size="40" color="#666"></uni-icons>
	    </view>

    <!-- 键盘 -->
    <view class="keyboard">

      <view class="row">
        <view v-for="k in row1" :key="k" class="key" @click="input(k)">
          <text>{{ k }}</text>
        </view>
      </view>

      <view class="row">
        <view v-for="k in row2" :key="k" class="key" @click="input(k)">
          <text>{{ k }}</text>
        </view>
      </view>

      <view class="row">
        <view v-for="k in row3" :key="k" class="key" @click="input(k)">
          <text>{{ k }}</text>
        </view>
      </view>

      <view class="row">
        <view
          v-for="k in row4"
          :key="k.value"
          :class="['key', k.type]"
          @click="handleSpecial(k)"
        >
          <text v-if="k.type === 'normal'">{{ k.value }}</text>
          <text v-if="k.type === 'delete'">⌫</text>
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
          <text v-if="k.type === 'heart'" class="heart">♡</text>

          <view v-if="k.type === 'space'" class="space-key">
            <view class="key-space-line"></view>
          </view>
        </view>
      </view>

    </view>

  </view>
</template>

<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
	import RightToast from '@/components/RightToast.vue'
const codeList = ref(['', '', '', '', ''])
const currentIndex = ref(0)

const row1 = ['1','2','3','4','5','6','7','8','9','0']
const row2 = ['Q','W','E','R','T','Y','U','I','O','P']
const row3 = ['A','S','D','F','G','H','J','K','L']

const row4 = [
  { value: 'Z', type: 'normal' },
  { value: 'X', type: 'normal' },
  { value: 'C', type: 'normal' },
  { value: 'V', type: 'normal' },
  { value: 'B', type: 'normal' },
  { value: 'N', type: 'normal' },
  { value: 'M', type: 'normal' },
  { value: 'del', type: 'delete' }
]

const row5 = [
  { value: '+', type: 'normal' },
  { value: '-', type: 'normal' },
  { value: '/', type: 'normal' },
  { value: '?', type: 'normal' },
  { value: ' ', type: 'space' },
  { value: '!', type: 'normal' },
  { value: '@', type: 'normal' },
  { value: ':', type: 'normal' },
  { value: '♡', type: 'heart' }
  
]

const onSend = () =>{
      console.log('发送')
      // 你的跳转逻辑
      // uni.reLaunch({ url: '/pages/xxx/xxx' })
    }

const vibrate = () => {
  uni.vibrateShort({ type: 'light' })
}

const input = (val) => {
  vibrate()
  codeList.value[currentIndex.value] = val
  if (currentIndex.value < 4) currentIndex.value++
}

const handleSpecial = (k) => {
  vibrate()

  if (k.type === 'delete') {
    if (codeList.value[currentIndex.value]) {
      codeList.value[currentIndex.value] = ''
    } else if (currentIndex.value > 0) {
      currentIndex.value--
      codeList.value[currentIndex.value] = ''
    }
    return
  }

  input(k.value)
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

.float-btn {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.2s ease;
}

/* 点击反馈：明显变暗 + 缩小 */
.btn-hover {
  background-color: #cccccc;
  transform: translate(-50%, -50%) scale(0.85);
}

.nav-bar {
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 输入框 */
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.code-item.active {
  border-color: #555;
}

.input-space-line {
  position: absolute;
  bottom: 16rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2rpx;
  background: #bbb;
}

.cursor {
  width: 2rpx;
  height: 50%;
  background: #999;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* ===== 键盘 ===== */
.keyboard {
  margin-top: auto;

  /* ✅ 核心：往上抬 + 适配底部安全区 */
  padding: 10rpx 10rpx calc(30rpx + env(safe-area-inset-bottom));
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
  border-radius: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.key:active {
  transform: scale(0.88);
  background: #e5e5e5;
}

.key-space-line {
  position: absolute;
  bottom: 12rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2rpx;
  background: #bbb;
}

.space {
  flex: 3;
}

.delete {
  flex: 1.5;
  background: #eee;
}

.heart {
  color: #000;
}
</style>