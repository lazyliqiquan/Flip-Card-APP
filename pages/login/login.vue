<template>
	<view class="container">

		<view class="content">

			<input v-model="link" class="input" placeholder="请输入设备链接" />

			<button class="btn" @click="handleLogin">
				连接设备
			</button>
			<RightToast ref="toastRef" />

		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import RightToast from '@/components/RightToast.vue'

	const toastRef = ref(null)

	const link = ref('')
	let isClick = false
	const handleLogin = () => {
		if (isClick) return
		console.log('1')
		isClick = true
		setTimeout(() => {
			isClick = false
		}, 5000)
		// 拿到link.value，然后尝试连接该设备
		// 如果连接失败，展示失败的原因
		// toastRef.value.show('设备启动成是当今世界的卡就觉得功')
		uni.reLaunch({
			url: '/pages/sendMsg/sendMsg'
		})

	}
</script>

<style scoped>
	.container {
		position: relative;
		height: 100vh;
	}


	/* 内容 */
	.content {
		position: relative;
		z-index: 2;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	/* 输入框（方角 + 边框 + 大尺寸） */
	.input {
		width: 90%;
		height: 100rpx;
		background: #fff;
		border: 2rpx solid #ccc;
		border-radius: 0;
		/* ❗方角 */
		padding: 0 30rpx;
		font-size: 34rpx;
		box-sizing: border-box;
	}

	/* 按钮（完全对齐输入框） */
	.btn {
		width: 90%;
		height: 100rpx;
		margin-top: 40rpx;
		background-color: #868686;
		color: #fff;
		border-radius: 0;
		/* ❗方角 */
		font-size: 30rpx;

		display: flex;
		justify-content: center;
		align-items: center;

		/* 清掉默认样式干扰 */
		padding: 0;
		line-height: normal;
	}
</style>