<template>
	<TopBar :isShow="true" iconType="back" title="小学生时间" @click="back"></TopBar>
	<view class="container">
		<!-- ===== 三行展示 ===== -->
		<view class="row" v-for="(item, index) in rows" :key="index">
			<view class="boxes-wrapper">
				<view class="boxes">
					<view v-for="(box, i) in item" :key="i" class="box"
						:class="{active: index === current_row && i  === current_column }">
						{{ box }}
					</view>
				</view>
			</view>

		</view>

		<!-- ===== 分割线 ===== -->
		<view class="divider"></view>

		<!-- ===== 运算按钮 ===== -->
		<view class="operator-row">
			<view v-for="op in operators" :key="op.value" class="operator-btn" :class="op.active ? 'active' : ''"
				@click="toggleOperator(op)">
				<text class="op-text">{{ op.label }}</text>
			</view>
		</view>

		<!-- ===== 分割线 ===== -->
		<view class="divider"></view>

		<!-- 整行浅灰色按钮 -->
		<view class="full-row-btn" @click="send">
			<text class="btn-text">开始</text>
		</view>

		<RightToast ref="toastRef" />

	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onUnmounted
	} from 'vue'
	import TopBar from '@/components/TopBar.vue'
	import RightToast from '@/components/RightToast.vue'
	import {
		useDeviceStore
	} from '@/stores/device'
	const store = useDeviceStore()
	const toastRef = ref(null)

	function back() {
		uni.reLaunch({
			url: '/pages/home/home'
		})
	}

	const rows = ref([
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	])

	const result = ref([
		['', '', '', '', ''],
		['', '', '', '', ''],
		['', '', '', '', '']
	])

	const operators = ref([{
			label: '+',
			value: 'add',
			active: true
		},
		{
			label: '-',
			value: 'sub',
			active: true
		},
		{
			label: '*',
			value: 'mul',
			active: true
		},
		{
			label: '/',
			value: 'div',
			active: true
		}
	])


	// 随机获取单个数组元素，无下标越界
	function getRandItem(arr) {
		let idx = Math.floor(Math.random() * arr.length)
		return arr[idx]
	}

	// 根据给定算式，随即得到
	function createExpr(op) {
		const maxChar = 5;
		let a, b, expr, res;

		while (true) {
			// 随机1~3位正整数
			const getNum = () => Math.floor(Math.random() * 999) + 1;

			if (op === '+') {
				a = getNum();
				b = getNum();
				res = a + b;
			} else if (op === '-') {
				a = getNum();
				b = getNum();
				res = a - b;
			} else if (op === '*') {
				a = getNum();
				b = getNum();
				res = a * b;
			} else if (op === '/') {
				// 反向生成，确保整除
				let quotient = getNum();
				b = getNum();
				a = quotient * b;
				res = quotient;
			}

			expr = `${a}${op}${b}`
			// 校验字符长度
			if (expr.length > maxChar) {
				continue
			}
			if (String(res).length > maxChar) {
				continue
			}
			break
		}

		// 转为字符数组，不足5位补空字符
		let arr = []
		let charArr = expr.split('');
		while (charArr.length < 5) {
			charArr.unshift(' ')
		}
		arr.push(charArr)

		charArr = String(res).split('')
		while (charArr.length < 5) {
			charArr.unshift(' ')
		}
		arr.push(charArr)
		return arr
	}

	function refresh() {
		const arr = []
		operators.value.forEach((e, i) => {
			if (e.active) {
				arr.push(e.label)
			}
		})
		for (let i = 0; i < 3; i++) {
			const e = getRandItem(arr)
			let a = createExpr(e)
			rows.value[i] = a[0]
			result.value[i] = a[1]
		}
		console.log(rows.value, result.value)
	}


	const toggleOperator = (op) => {
		op.active = !op.active
		let flag = true
		operators.value.forEach((e, i) => {
			if (e.active) {
				flag = false
			}
		})
		if (flag) {
			toastRef.value.show('算式种类不能为空')
			op.active = !op.active
		} else {
			refresh()
		}
	}



	onMounted(() => {
		refresh()
	})

	let current_row = ref(-1)
	let current_column = ref(0)
	let timer
	let flag = false

	async function send() {
		if (flag) {
			toastRef.value.show('当前算式正在发送中')
			return
		}
		flag = true
		current_row.value = -1
		let timer_column = setInterval(() => {
			current_column.value = (current_column.value + 1) % 5;
		}, 900)
		setTimeout(() => {
			clearInterval(timer_column)
			flag = false
		}, 75000)



		let i = -1

		async function func() {
			i++
			let timer_temp = setTimeout(async () => {
				await store.control('3' + result.value[i].join('').toString())
				if (!store.isSucceed) {
					toastRef.value.show(`发送算式${i}答案失败`)
					current_row.value = -1
					clearInterval(timer)
					clearTimeout(timer_temp)
					return
				}
			}, 15000)
			current_row.value = i
			current_column.value = 0
			await store.control('3' + rows.value[i].join('').toString())
			if (!store.isSucceed) {
				toastRef.value.show(`发送算式${i}失败`)
				current_row.value = -1
				clearInterval(timer)
				clearTimeout(timer_temp)
				return
			}
			if (i >= 2) {
				current_row.value = -1
				clearInterval(timer)
				return
			}
		}

		await func()

		timer = setInterval(async () => {
			await func()
		}, 25000)
	}

	onUnmounted(() => {
		clearInterval(timer)
		clearInterval(timer_column)
	})
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

	.box.active {
		background: #e5e5e5;
		color: #fff;
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
		color: #555;
		/* 👉 深灰 */
	}



	.full-row-btn {
		width: 100%;
		height: 110rpx;
		background: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	/* 点击按压效果 */
	.full-row-btn:active {
		background: #e8e8e8;
		transform: scale(0.98);
	}

	.btn-text {
		font-size: 28rpx;
		color: #333;
	}
</style>