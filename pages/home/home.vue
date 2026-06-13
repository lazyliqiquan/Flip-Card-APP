<template>
	<view class="container">
		<!-- 自定义导航栏 -->
		<view class="navbar">
			<view v-show="userStore.isRoot" class="nav-left" @click="openRoot">
				<view class="icon-btn">
					<uni-icons type="contact" size="20" color="#333"></uni-icons>
				</view>
			</view>
			<view class="nav-title">设备控制</view>

			<view class="nav-right" @click="openSetting">
				<view class="icon-btn">
					<uni-icons type="gear" size="20" color="#333"></uni-icons>
				</view>
			</view>
		</view>
		<!-- 中央按钮区域 -->
		<view class="content">
			<view class="panel">
				<view v-for="(item, index) in btnList" :key="index" class="panel-btn"
					:class="{ active: index === store.model }" @click="handleClick(index)">
					<uni-icons :class="item.icon" size="25" :color="index === store.model ? '#fff' : '#666'" />
					<span style="height: 30rpx;"></span>
					<text>{{ item.name }}</text>
				</view>
			</view>

		</view>
		<RightToast ref="toastRef" />

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import RightToast from '@/components/RightToast.vue'
	import {
		useDeviceStore
	} from '@/stores/device'
	import {
		useUserStore
	} from '@/stores/user.js'

	import {
		onLoad
	} from "@dcloudio/uni-app";
	import Request from '@/utils/request'

	const store = useDeviceStore()
	const userStore = useUserStore()
	const toastRef = ref(null)
	// 获取当前设备的状态
	onLoad(async () => {
		if (store.model !== -1) {
			return
		}
		await store.control('4')
		if (!store.isSucceed) {
			toastRef.value.show('查询设备状态失败，请检查设备连接是否正常')
		}
	})

	const btnList = [{
			name: '时间',
			icon: 'iconfont icon-time'
		}, {
			name: '日期',
			icon: 'iconfont icon-date'
		}, {
			name: '文本',
			icon: 'iconfont icon-msg'
		},
		// {
		// 	name: '算术',
		// 	icon: 'iconfont icon-jisuan'
		// },

	]

	function openRoot() {
		uni.navigateTo({
			url: '/pages/root/root'
		})
	}

	function openSetting() {
		uni.navigateTo({
			url: '/pages/setting/setting'
		})
	}

	const handleClick = (index) => {
		store.futureModel = index
		uni.navigateTo({
			url: `/pages/trial/trial`
		})
	}
</script>

<style scoped>
	/* 页面整体 */
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #f5f6f7;
	}

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


	/* 图标按钮 */
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

	/* ===== 内容区 ===== */
	.content {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 面板 */
	.panel {
		width: 92%;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20rpx;
	}

	/* 最后一个子项单独居中 */
	.panel> :last-child {
		grid-column: 1 / -1;
		/* justify-self: center; */
	}

	/* ✅ 正方形按钮（唯一关键点） */
	.panel-btn {
		aspect-ratio: 1 / 1;
		/* ⭐ 正方形 */

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20rpx;

		padding: 30rpx;
		/* ⭐ 留白关键 */

		background: #e5e5e5;
		border-radius: 24rpx;

		box-sizing: border-box;
		transition: all 0.2s;
	}

	/* 文字 */
	.panel-btn text {
		font-size: 30rpx;
	}

	/* 点击反馈 */
	.panel-btn:active {
		transform: scale(0.96);
	}

	/* 激活 */
	.panel-btn.active {
		background: #8c8c8c;
		color: #fff;
	}
</style>