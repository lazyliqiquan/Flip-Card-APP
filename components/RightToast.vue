<template>
	<view class="wrapper">

		<!-- 提示框 -->
		<view class="toast" :class="{ show: visible }">

			<!-- 内容 -->
			<view class="content">
				<text class="msg">{{ message }}</text>

				<!-- 关闭按钮 -->
				<text class="close" @click="hide">×</text>
			</view>

		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const visible = ref(false)
	const message = ref('')
	let timer = null

	/* 显示方法（给外部调用） */
	const show = (msg = '操作成功') => {
		message.value = msg
		visible.value = true

		clearTimeout(timer)
		timer = setTimeout(() => {
			hide()
		}, 5000)
	}

	/* 隐藏 */
	const hide = () => {
		visible.value = false
		clearTimeout(timer)
	}

	/* 暴露方法 */
	defineExpose({
		show,
		hide
	})
</script>

<style scoped>
	/* 外层 */
	.wrapper {
		position: fixed;
		top: 100rpx;
		right: 0;
		z-index: 999;
	}

	/* 主体 */
	.toast {
		transform: translateX(100%);
		transition: transform 0.3s ease;
	}

	/* 显示状态 */
	.toast.show {
		transform: translateX(0);
	}

	/* 内容 */
	.content {
		min-width: 260rpx;
		padding: 20rpx 30rpx;
		background: #333;
		color: #fff;

		display: flex;
		align-items: center;
		justify-content: space-between;

		border-top-left-radius: 16rpx;
		border-bottom-left-radius: 16rpx;

		box-shadow: -6rpx 6rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	/* 文本 */
	.msg {
		font-size: 28rpx;
	}

	/* 关闭按钮 */
	.close {
		margin-left: 20rpx;
		font-size: 34rpx;
		padding: 0 10rpx;
	}
</style>