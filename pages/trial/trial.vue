<template>
	<TopBar :isShow="true" iconType="back" title="验证非人机" @click="back"></TopBar>
	<!-- 卡片 -->
	<view class="card">
		<view class="progress">{{ current + 1 }}/{{ 3 }}</view>

		<view class="question">{{ expr }}</view>

		<input v-model="answer" type="number" class="input" placeholder="输入答案" @confirm="submit" />

		<button class="btn" @click="submit">提交答案</button>
	</view>
	<RightToast ref="toastRef" />
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useDeviceStore
	} from '@/stores/device'
	import TopBar from '@/components/TopBar.vue'
	import RightToast from '@/components/RightToast.vue'
	const current = ref(0)
	const answer = ref('')
	const expr = ref('')
	const correct = ref(0)
	const toastRef = ref(null)
	const store = useDeviceStore()

	function back() {
		uni.reLaunch({
			url: '/pages/home/home'
		})
	}

	// 生成题目
	function generate() {
		const a = Math.floor(Math.random() * 90) + 10
		const b = Math.floor(Math.random() * 90) + 10
		expr.value = `${a} + ${b} =`
		correct.value = a + b
	}

	// 提交
	const submit = async () => {
		const val = parseInt(answer.value)
		if (isNaN(val)) {
			uni.showToast({
				title: '请输入答案',
				icon: 'none'
			})
			return
		}

		if (val === correct.value) {
			if (current.value + 1 >= 1) {
				if (store.futureModel <= 1) {
					await store.control(store.futureModel.toString())
					if (!store.isSucceed) {
						toastRef.value.show('查询设备状态失败，请检查设备连接是否正常')
					}
					back()
				} else if (store.futureModel == 2) {
					if (store.model === store.futureModel) {
						await store.control('2' + store.codeList.join(''))
						toastRef.value.show(store.isSucceed ? '发送成功' : '发送失败')
					}
					uni.reLaunch({
						url: '/pages/sendMsg/sendMsg'
					})
				} else {
					uni.reLaunch({
						url: '/pages/calcGame/calcGame'
					})
				}
			} else {
				current.value++
				answer.value = ''
				generate()
			}
			uni.showToast({
				title: '回答正确',
				icon: 'none'
			})
		} else {
			uni.showToast({
				title: '答案错误',
				icon: 'none'
			})
		}
	}

	onMounted(() => {
		generate()
	})
</script>

<style scoped>
	/* 卡片：左右相等间隙 + 内部超大垂直间距 */
	.card {
		background: #fff;
		border-radius: 20rpx;
		margin-top: 100rpx;
		padding: 80rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 100rpx;
		/* 🔥 元素之间超大距离 */
	}

	.progress {
		width: 100%;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}

	.question {
		width: 100%;
		text-align: center;
		font-size: 60rpx;
		font-weight: 500;
		color: #222;
		margin-top: 20rpx;
	}

	.input {
		width: 80%;
		height: 90rpx;
		border: 2rpx solid #ddd;
		border-radius: 12rpx;
		text-align: center;
		font-size: 36rpx;
		color: #333;
		margin-top: 30rpx;
	}

	.btn {
		width: 80%;
		height: 120rpx;
		line-height: 120rpx;
		background: #333;
		color: #fff;
		border-radius: 12rpx;
		font-size: 30rpx;
		border: none;
		margin-top: 30rpx;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.success {
		background: #fff;
		padding: 40rpx 60rpx;
		border-radius: 16rpx;
		font-size: 32rpx;
		color: #222;
	}
</style>