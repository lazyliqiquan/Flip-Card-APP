<template>
	<!-- 自定义导航栏 -->
	<view class="navbar">
		<view class="nav-left" @click="back">
			<view class="icon-btn">
				<uni-icons type="back" size="20" color="#333"></uni-icons>
			</view>
		</view>
		<view class="nav-title">管理员界面</view>
	</view>

	<view class="admin-container">
		<view class="module-card">
			<input class="full-input" v-model="username" placeholder="请输入用户名（仅字母、下划线）" @input="formatInput()" />
			<button class="full-btn mt-space" @click="submitCreate">创建用户</button>
			<button class="full-btn mt-space" @click="submitDelete">删除用户</button>
			<button class="full-btn mt-space" @click="searchContorlUser">查询&控制用户</button>
			<!-- 用户信息展示区 -->
			<view v-if="store.singleUser.length" class="info-panel mt-space">
				<text class="info-item">用户名：{{ store.singleUser[0].username }}</text>
				<text class="info-item">最近登录时间：{{ store.singleUser[0].login_time || '暂无登录记录' }}</text>
				<button class="full-btn mt-space" @click="copyUserLink">复制该用户加密链接</button>
				<!-- 5个按钮横向排列 -->
				<text class="info-item mt-space">步进电机误差值(从左到右、每步需91脉冲)</text>
				<view class="btn-row mt-space">
					<button class="num-btn" @click="openInput(0)">{{ motorErrList[0] }}</button>
					<button class="num-btn" @click="openInput(1)">{{ motorErrList[1] }}</button>
					<button class="num-btn" @click="openInput(2)">{{ motorErrList[2] }}</button>
					<button class="num-btn" @click="openInput(3)">{{ motorErrList[3] }}</button>
					<button class="num-btn" @click="openInput(4)">{{ motorErrList[4] }}</button>
				</view>
				<!-- 自定义居中弹窗 -->
				<view v-if="showPopup" class="mask" @click.self="closePopup">
					<view class="dialog">
						<view class="dialog-title">设置数值</view>
						<input class="dialog-input" v-model="tempVal" type="number" placeholder="正数 / 负数均可，例：-5、100"
							:focus="showPopup" />
						<view class="dialog-divider"></view>
						<view class="dialog-action">
							<view class="action-btn cancel" @click="closePopup">取消</view>
							<view class="action-btn confirm" @click="onConfirm">确定</view>
						</view>
					</view>
				</view>
				<button class="full-btn mt-space" @click="verifyErr">矫正误差</button>
				<button class="full-btn close-btn mt-space" @click="store.singleUser = []">关闭</button>
			</view>
		</view>

		<!-- 4. 查找所有用户 -->
		<view class="module-card">
			<button class="full-btn" @click="getAllUserList">加载全部用户</button>
			<!-- 全部用户列表弹窗 -->
			<view v-if="showAllUserBox" class="all-user-dialog">
				<view class="scroll-wrap">
					<view class="user-row" v-for="(item, index) in store.user_list" :key="index">
						<text>用户名：{{ item.username}}</text>
						<text>登录时间：{{ item.login_time || '暂无登录记录' }}</text>
					</view>
				</view>
				<button class="full-btn close-btn" @click="showAllUserBox = false">关闭</button>
			</view>
		</view>
	</view>

	<RightToast ref="toastRef" />
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import RightToast from '@/components/RightToast.vue'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		useDeviceStore
	} from '@/stores/device.js'
	import {
		aesEncrypt
	} from '@/utils/crypto'
	import Request from '@/utils/request'
	const store = useUserStore()
	const deviceStore = useDeviceStore()

	onLoad(() => {
		// 清理缓存数据
		store.singleUser = []
		store.user_list = []
	})

	function back() {
		uni.navigateBack({
			delta: 1
		})
	}

	const toastRef = ref(null)
	// 正则：仅允许大小写字母 + 下划线
	const reg = /[^A-Za-z_]/g
	// 输入过滤，自动剔除非法字符
	const username = ref('')

	const formatInput = () => {
		username.value = username.value.replace(reg, '')
	}
	// ========================================================	创建用户 ===========================
	// 创建用户（纯前端占位，自行对接接口）
	const submitCreate = async () => {
		const name = username.value.trim()
		if (!name) {
			uni.showToast({
				title: '用户名不能为空',
				icon: 'none'
			})
			return
		}
		await store.createUser(name)
		if (store.isSucceed) {
			toastRef.value.show('创建新用户成功')
		} else {
			toastRef.value.show('创建新用户失败')
		}
	}
	// 删除用户（纯前端占位，自行对接接口）
	const submitDelete = async () => {
		const name = username.value.trim()
		if (!name) {
			uni.showToast({
				title: '用户名不能为空',
				icon: 'none'
			})
			return
		}
		// 此处自行添加接口逻辑
		await store.deleteUser(name)
		if (store.isSucceed) {
			toastRef.value.show('删除用户成功')
		} else {
			toastRef.value.show('删除用户失败')
		}
	}
	// =============================================查询用户 ============================
	// 初始化5个按钮默认文字作为设备步进电机的误差值，你可以改成 0 或者空
	const motorErrList = ref([0, 0, 0, 0, 0])
	// 查找单个用户（纯前端占位，自行对接接口）
	const searchContorlUser = async () => {
		const name = username.value.trim()
		if (!name) {
			uni.showToast({
				title: '请输入用户名',
				icon: 'none'
			})
			return
		}
		await store.getUserInfo(name)
		// 用户要确实存在才查询该设备的误差值
		if (store.isSucceed && store.singleUser.length !== 0) {
			// 控制的设备变了，需要清除上一个设备留下来的缓存
			deviceStore.cleanData()
			toastRef.value.show('查询用户成功')
			// 查询当前设备误差
			await deviceStore.control('7')
			if (deviceStore.isSucceed) {
				console.log(deviceStore.device_reply)
				// 倒置一下，确保步进电机顺序对的上
				const temp_arr = deviceStore.device_reply.split('$').reverse()
				if (temp_arr.length === 5) {
					for (let i = 0; i < 5; i++) {
						motorErrList.value[i] = temp_arr[i]
					}
				}
			} else {
				toastRef.value.show('查询设备误差值失败')
			}
		} else {
			toastRef.value.show('查询用户失败')
		}
	}
	// ===========================================复制用户加密链接======================================================
	// 复制指定用户的设备加密链接
	function copyUserLink() {
		uni.setClipboardData({
			data: aesEncrypt(`${store.singleUser[0].username}#${Request.url}`),
			success: () => {
				toastRef.value.show('复制成功')
			}
		})
	}
	// =================================================矫正误差=========================================================
	const showPopup = ref(false)
	const currentIndex = ref(0)
	const tempVal = ref('')
	const openInput = (idx) => {
		currentIndex.value = idx
		tempVal.value = String(motorErrList.value[idx])
		showPopup.value = true
	}
	const closePopup = () => {
		showPopup.value = false
	}
	const onConfirm = () => {
		const n = Number(tempVal.value)
		if (isNaN(n)) {
			uni.showToast({
				title: '请输入有效的数字',
				icon: 'none'
			})
			return
		}
		// 因为步进电机使用的转动模式转一圈总共最多只需要4096个脉冲信号
		if (n < 4096 && n > -4096) {
			motorErrList.value[currentIndex.value] = n

		} else {
			uni.showToast({
				title: '请输入有效的数字',
				icon: 'none'
			})
		}
		closePopup()
	}
	const verifyErr = async () => {
		await deviceStore.control('7' + [...motorErrList.value].reverse().join('$'))
		console.log('Hello')
		if (deviceStore.isSucceed) {
			toastRef.value.show('修改设备误差值成功')
		} else {
			toastRef.value.show('修改设备误差值失败')
		}
	}
	// =============================================加载全部用户=================================================
	// 弹窗状态
	const showAllUserBox = ref(false)
	// 查找所有用户（纯前端占位，自行对接接口）
	const getAllUserList = async () => {
		await store.getAllUsers()
		if (store.isSucceed) {
			showAllUserBox.value = true
			toastRef.value.show('查询全部用户信息成功')
		} else {
			toastRef.value.show('查询全部用户信息失败')
		}
	}
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

	/* 页面整体 */
	.admin-container {
		background-color: #f2f2f2;
		min-height: 100vh;
		padding: 40rpx;
		box-sizing: border-box;
	}

	/* 功能模块卡片 - 分层、大间距 */
	.module-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
	}

	/* 模块标题 */
	.module-title {
		font-size: 34rpx;
		color: #333333;
		font-weight: 500;
		display: block;
		margin-bottom: 35rpx;
	}

	/* 通栏输入框 */
	.full-input {
		width: 100%;
		height: 90rpx;
		background-color: #eeeeee;
		border-radius: 14rpx;
		padding: 0 25rpx;
		font-size: 30rpx;
		color: #333;
		box-sizing: border-box;
	}

	/* 通栏按钮 */
	.full-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		background-color: #e5e5e5;
		color: #333333;
		border-radius: 14rpx;
		font-size: 30rpx;
		margin: 0;
	}

	/* 通用上边距 */
	.mt-space {
		margin-top: 30rpx;
	}

	/* 单用户信息面板 */
	.info-panel {
		background-color: #f7f7f7;
		border-radius: 14rpx;
		padding: 30rpx;
	}

	.info-item {
		display: block;
		font-size: 28rpx;
		color: #444;
		line-height: 55rpx;
	}

	/* 全局遮罩层 */
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	/* 弹窗容器 */
	.dialog {
		width: 88%;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		box-sizing: border-box;
	}

	/* 全部用户弹窗盒子 */
	.all-user-dialog {
		width: 100%;
		margin-top: 30rpx;
		background-color: #fff;
		border-radius: 14rpx;
		overflow: hidden;
	}

	/* 滚动区域 - 支持长列表滑动 */
	.scroll-wrap {
		max-height: 700rpx;
		overflow-y: auto;
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
	}

	/* 用户列表行 */
	.user-row {
		padding: 25rpx 0;
		border-bottom: 1rpx solid #dddddd;
	}

	.user-row:last-child {
		border-bottom: none;
	}

	.user-row text {
		display: block;
		font-size: 28rpx;
		color: #444;
		line-height: 50rpx;
	}

	/* 列表弹窗关闭按钮 */
	.close-btn {
		border-radius: 0;
	}

	.btn-row {
		display: flex;
		flex-direction: row;
		gap: 16rpx;
	}

	.num-btn {
		flex: 1;
		font-size: 24rpx;
		padding: 10rpx 0;
		margin: 0;
	}

	/* 遮罩层 */
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.42);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dialog {
		width: 640rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.dialog-title {
		text-align: center;
		font-size: 34rpx;
		color: #222;
		padding: 36rpx 30rpx 20rpx;
		font-weight: 500;
	}

	.dialog-input {
		margin: 0 30rpx;
		padding: 24rpx 20rpx;
		background-color: #f7f8fa;
		border-radius: 12rpx;
		font-size: 32rpx;
	}

	.dialog-divider {
		height: 1rpx;
		background-color: #eeeeee;
		margin-top: 30rpx;
	}

	.dialog-action {
		display: flex;
	}

	.action-btn {
		flex: 1;
		text-align: center;
		padding: 26rpx 0;
		font-size: 32rpx;
	}

	.cancel {
		color: #666;
		background-color: #fff;
		border-right: 1rpx solid #eee;
	}

	.confirm {
		color: #409eff;
		background-color: #fff;
		font-weight: 500;
	}
</style>