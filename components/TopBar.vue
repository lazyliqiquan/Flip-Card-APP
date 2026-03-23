<template>
	<!-- 自定义导航栏 -->
	<view class="navbar">
		<view v-show="true" class="nav-left" @click="back">
			<view class="icon-btn">
				<uni-icons type="back" size="20" color="#333"></uni-icons>
			</view>
		</view>
		<view class="nav-title">设备控制</view>

		<view class="nav-right" @click="openSetting">
			<view class="icon-btn">
				<uni-icons type="gear" size="20" color="#333"></uni-icons>
			</view>
		</view>
	</view>

</template>

<script>
</script>

<style>
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

	.nav-right {
		position: absolute;
		right: 30rpx;
		bottom: 20rpx;
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
</style>