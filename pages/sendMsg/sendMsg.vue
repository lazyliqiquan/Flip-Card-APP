<template>
	<TopBar></TopBar>
	<!-- 验证码5格输入框 -->
	<view class="code-wrapper">
		<uni-tag text="1"></uni-tag>
		<view class="code-container">
			<view v-for="(item, index) in codeList" :key="index" class="code-item"
				:class="{ active: activeIndex === index }" @click="handleClick(index)">
				<!-- 显示输入的字符 -->
				<text v-if="item" class="code-text">{{ item }}</text>

				<!-- 闪动光标 -->
				<view v-else class="cursor" :class="{ blink: activeIndex === index }"></view>
			</view>
		</view>
		<view class="icon-btn">
			<uni-icons type="closeempty" size="20" color="#333"></uni-icons>
		</view>
	</view>

</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
import TopBar from '@/components/TopBar.vue'
	// 验证码数组（5格）
	const codeList = ref(['1', '2', '3', '❤', ''])

	// 当前激活的格子索引
	const activeIndex = ref(0)

	// 点击格子 → 切换光标位置（不会弹出键盘）
	const handleClick = (index) => {
		activeIndex.value = index
	}

	// 你自己的键盘只需要调用这个方法即可！
	// 输入字符
	const inputChar = (char) => {
		if (activeIndex.value < 5) {
			codeList.value[activeIndex.value] = char
			// 自动跳到下一格
			if (activeIndex.value < 4) {
				activeIndex.value++
			}
		}
	}

	// 删除字符
	const deleteChar = () => {
		if (activeIndex.value >= 0) {
			// 当前格子有内容 → 清空
			if (codeList.value[activeIndex.value]) {
				codeList.value[activeIndex.value] = ''
			} else {
				// 无内容 → 跳回上一格并清空
				if (activeIndex.value > 0) {
					activeIndex.value--
					codeList.value[activeIndex.value] = ''
				}
			}
		}
	}

	// 向外暴露方法给你的键盘使用
	defineExpose({
		inputChar,
		deleteChar
	})
</script>

<style scoped>
	/* 外层容器 */
	.code-wrapper {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 30rpx 0;

	}

	/* 格子容器 */
	.code-container {
		display: flex;
		gap: 10rpx;
	}

	/* 单个验证码格子 */
	.code-item{
		width: 80rpx;
		height: 100rpx;
		border: 2rpx solid #e1e5e9;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		position: relative;
		margin-right: 10rpx;
	}
	.code-item:nth-child(5){
		margin-right: 0rpx;
	}

	/* 激活状态（当前输入框） */
	.code-item.active {
		border-color: #767676;
	}

	/* 输入的文字 */
	.code-text {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
	}

	/* 光标样式 */
	.cursor {
		width: 4rpx;
		height: 60rpx;
		background-color: #767676;
		opacity: 0;
	}

	/* 光标闪烁动画 */
	.cursor.blink {
		animation: blink 1s infinite step-end;
	}

	@keyframes blink {

		0%,
		100% {
			opacity: 1;
		}

		50% {
			opacity: 0;
		}
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