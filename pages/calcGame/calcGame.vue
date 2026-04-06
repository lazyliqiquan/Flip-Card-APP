<template>
  <TopBar></TopBar>
  <view class="container">

    <!-- ===== 三行展示 ===== -->
    <view class="row" v-for="(item, index) in rows" :key="index">
      


      <view class="boxes-wrapper">
        <view class="boxes">
          <view 
            v-for="(box, i) in item.values" 
            :key="i" 
            class="box"
          >
            {{ box }}
          </view>
        </view>
      </view>

      <view 
        class="status"
        :class="item.sent ? 'sent' : 'unsent'"
      >
        {{ item.sent ? 'ED' : 'ING' }}
      </view>

    </view>

    <!-- ===== 分割线 ===== -->
    <view class="divider"></view>

    <!-- ===== 运算按钮 ===== -->
    <view class="operator-row">
      <view 
        v-for="op in operators" 
        :key="op.value"
        class="operator-btn"
        :class="op.active ? 'active' : ''"
        @click="toggleOperator(op)"
      >
        <text class="op-text">{{ op.label }}</text>
      </view>
    </view>

    <!-- ===== 底部按钮 ===== -->
    <view class="action-row">
      <view class="action-btn" @click="refresh">
        <uni-icons type="refreshempty" size="36" color="#555"></uni-icons>
      </view>
      <view class="action-btn" @click="send">
        <uni-icons type="paperplane" size="36" color="#555"></uni-icons>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'


const rows = ref([
  { values: ['9', '0', '-', '8', '0'], sent: false },
  { values: ['', '', '', '', ''], sent: false },
  { values: ['', '', '', '', ''], sent: false }
])

const operators = ref([
  { label: '+', value: 'add', active: false },
  { label: '-', value: 'sub', active: false },
  { label: '×', value: 'mul', active: false },
  { label: '/', value: 'div', active: false }
])

const toggleOperator = (op) => {
  op.active = !op.active
}

const refresh = () => {
  rows.value.forEach(row => {
    row.values = ['', '', '', '', '']
    row.sent = false
  })
}

const send = () => {
  rows.value.forEach(row => {
    row.sent = true
  })
}
</script>

<style scoped>
.container {
  padding: 30rpx 20rpx;
}

/* ===== 行 ===== */
.row {
  display: flex;
  align-items: center;
  margin-bottom: 50rpx;
}

/* ===== 序号 ===== */
.index-circle {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background-color: #e5e5e5;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28rpx;
}

/* ===== 中间居中 ===== */
.boxes-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.boxes {
  display: flex;
}

/* ===== 方框 ===== */
.box {
  width: 100rpx;
  height: 100rpx;
  margin: 0 10rpx;

  border-radius: 20rpx;
  border: 2rpx solid #ddd;
  background-color: #fafafa;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 36rpx;
  font-weight: 600;
}

/* ===== 状态 ===== */
.status {
  margin-left: 20rpx;
  padding: 14rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
}

.unsent {
  background-color: #fff;
  border: 1rpx solid #ccc;
}

.sent {
  background-color: #d9d9d9;
}

/* ===== 分割线 ===== */
.divider {
  height: 2rpx;
  background-color: #eee;
  margin: 40rpx 0;
}

/* ===== 运算按钮（缩小版） ===== */
.operator-row {
  display: flex;
  justify-content: space-around;
  margin-top: 20rpx;
}

.operator-btn {
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;

  background-color: #fff;
  border: 2rpx solid #ccc;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.15s;
}

.operator-btn.active {
  background-color: #d9d9d9;
}

.operator-btn:active {
  transform: scale(0.88);
}

.op-text {
  font-size: 34rpx;
  color: #555;   /* 👉 深灰 */
}

/* ===== 底部按钮 ===== */
.action-row {
  display: flex;
  justify-content: space-around;
  margin-top: 50rpx;
}

.action-btn {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;

  background-color: #d9d9d9;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.15s;
}

.action-btn:active {
  transform: scale(0.88);
}
</style>