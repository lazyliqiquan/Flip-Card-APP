<template>
	<!-- 自定义导航栏 -->
	<view class="navbar">
		<view class="nav-left" @click="back">
			<view class="icon-btn">
				<uni-icons type="back" size="20" color="#333"></uni-icons>
			</view>
		</view>
		<view class="nav-title">验证</view>
	</view>

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
	import RightToast from '@/components/RightToast.vue'
	const current = ref(0)
	const answer = ref('')
	const expr = ref('')
	const correct = ref(0)
	const toastRef = ref(null)
	const store = useDeviceStore()

	function back() {
		uni.navigateBack({
			delta: 1
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
			if (current.value + 1 >= 3) {
				if (store.futureModel <= 1) {
					await store.control(store.futureModel.toString())
					if (!store.isSucceed) {
						toastRef.value.show('查询设备状态失败，请检查设备连接是否正常')
					}
					back()
				} else if (store.futureModel == 2) {
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
	/* ===== 导航栏 ===== */
	.navbar {
		height: 88rpx;
		padding-top: var(--status-bar-height);

		display: flex;
		align-items: center;
		justify-content: center;

		position: relative;
		background: #ffffff;
		border-bottom: 1rpx solid #eee;
	}

	.nav-title {
		font-size: 32rpx;
		font-weight: 600;
	}

	.nav-left {
		position: absolute;
		left: 30rpx;
		bottom: 20rpx;
	}

	.icon-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		background: #f0f0f0;
		border-radius: 12rpx;

		transition: all 0.15s;
	}

	.icon-btn:active {
		transform: scale(0.9);
		background: #e0e0e0;
	}


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