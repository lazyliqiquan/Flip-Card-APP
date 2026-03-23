<template>
	<view class="container">
		<TopBar></TopBar>
		<!-- 中央按钮区域 -->
		<view class="content">
			<view class="panel">
				<view v-for="(item, index) in btnList" :key="index" class="panel-btn"
					:class="{ active: activeIndex === index }" @click="handleClick(index)">
					<!-- <uni-icons :type="item.icon" size="36" :color="activeIndex === index ? '#fff' : '#666'" /> -->
					<uni-icons :class="item.icon" size="25" :color="activeIndex === index ? '#fff' : '#666'" />
					<span style="height: 30rpx;"></span>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import TopBar from '@/components/TopBar.vue'

	const activeIndex = ref(0)

	const btnList = [{
			name: '时间',
			icon: 'iconfont icon-time'
		}, {
			name: '日期',
			icon: 'iconfont icon-date'
		}, {
			name: '文本',
			icon: 'iconfont icon-msg'
		}, {
			name: '算术',
			icon: 'iconfont icon-jisuan'
		},

	]

	const handleClick = (index) => {
		activeIndex.value = index
	}

	const openSetting = () => {
		uni.showToast({
			title: '打开设置',
			icon: 'none'
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