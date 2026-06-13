<template>
	<!-- 自定义导航栏 -->
	<view class="navbar">
		<view class="nav-left" @click="back">
			<view class="icon-btn">
				<uni-icons type="back" size="20" color="#333"></uni-icons>
			</view>
		</view>
		<view class="nav-title">设备配置信息</view>
	</view>

	<!-- ================= -->

	<view class="config-wrap">
		<!-- 1、设备ID模块 -->
		<view class="item-box">
			<text class="item-title"><b>设备ID</b></text>
			<view class="item-content">
				<text class="text-val">{{userStore.username}}</text>
			</view>
		</view>
		<view class="split-line"></view>

		<!-- 2、设备状态模块 -->
		<view class="item-box">
			<text class="item-title"><b>设备状态</b></text>
			<view class="item-content">
				<text class="text-val">{{ store.isSucceed ? '正常' : '异常' }}</text>
			</view>
		</view>
		<view class="split-line"></view>

		<!-- 3、设备加密链接模块 -->
		<view class="item-box">
			<text class="item-title"><b>设备加密链接</b></text>
			<view class="item-content">
				<button class="gray-btn" @click="copyEncryptUrl">复制链接</button>
			</view>
		</view>
		<view class="split-line"></view>

		<!-- 4、默认密码模块（修改格式：SSID、密码分开标注） -->
		<view class="item-box">
			<text class="item-title"><b>默认WiFi配置</b></text>
			<view class="item-content">
				<text class="text-val">名称：{{ defaultSsid }}</text>
				<view style="margin-top:8rpx;"></view>
				<text class="text-val">密码：{{ defaultWifiPwd }}</text>
				<view style="margin-top:8rpx;"></view>
				<text class="tip-desc">(优先使用自定义WIFI配置)</text>
			</view>
		</view>
		<view class="split-line"></view>

		<!-- 5、修改wifi密码模块 -->
		<view class="item-box">
			<text class="item-title"><b>自定义WiFi配置</b></text>
			<view class="item-content">
				<text class="text-val">名称：{{ store.self_ssid ? store.self_ssid : '未配置'}}</text>
				<view style="margin-top:8rpx;"></view>
				<text class="text-val">密码：{{ store.self_pwd ? store.self_pwd : '未配置' }}</text>
				<view style="margin-top:8rpx;"></view>
				<button class="gray-btn mt10" @click="openWifiDialog">修改WiFi配置</button>
			</view>
		</view>
		<view class="split-line"></view>

		<!-- 6、设备校准模块 -->
		<view class="item-box">
			<text class="item-title"><b>设备校准</b></text>
			<view class="item-content">
				<button class="gray-btn" @click="deviceCalibrate">设备校准</button>
			</view>
		</view>
		<view class="split-line"></view>

		<!-- 7、退出当前账号 -->
		<view class="item-box">
			<view class="item-content">
				<button class="gray-btn" @click="logout">退出登陆</button>
			</view>
		</view>

		<!-- WiFi修改弹窗遮罩层 -->
		<view v-if="showWifiPop" class="pop-mask" @click="closeWifiDialog">
			<view class="pop-box" @click.stop>
				<view class="pop-item">
					<text class="pop-label">名称</text>
					<input class="pop-input" v-model="tempSsid" @input="filterDollar('ssid')" placeholder="" />
				</view>
				<view class="pop-item">
					<text class="pop-label">密码</text>
					<input class="pop-input" v-model="tempPwd" @input="filterDollar('pwd')" placeholder="" />
				</view>
				<view class="pop-btn-wrap">
					<button class="pop-send-btn" @click="sendWifiInfo">确认修改</button>
				</view>
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
		useDeviceStore
	} from '@/stores/device'
	import {
		useUserStore
	} from '@/stores/user'
	import Request from '@/utils/request'
	import {
		aesEncrypt
	} from '@/utils/crypto'




	const store = useDeviceStore()
	const userStore = useUserStore()
	const toastRef = ref(null)
	const link = ref(aesEncrypt(`${userStore.username}#${Request.url}`))
	// 拆分默认WIFI：SSID=Lqq，密码=Hello_lady
	const defaultSsid = ref('Lqq')
	const defaultWifiPwd = ref('Hello_lady')

	// 弹窗控制
	const showWifiPop = ref(false)
	const tempSsid = ref('')
	const tempPwd = ref('')

	onLoad(async () => {
		console.log('Heloo')
		await store.control('4')
		if (!store.isSucceed) {
			toastRef.value.show('查询设备状态失败，请检查设备连接是否正常')
		}
	})


	let send_flag = false
	// 打开弹窗
	const openWifiDialog = () => {
		if (send_flag) {
			toastRef.value.show('正在修改，请等待...')
			return
		}
		showWifiPop.value = true
		tempSsid.value = store.self_ssid
		tempPwd.value = store.self_pwd
	}
	// 关闭弹窗
	const closeWifiDialog = () => {
		showWifiPop.value = false
	}

	// 正则：非白名单字符全部替换为空
	const allowReg = /[^A-Za-z0-9!@#%&*_\-+=|\\:'?/,.]/g

	const filterDollar = (type) => {
		if (type === 'ssid') {
			tempSsid.value = tempSsid.value.replace(allowReg, '')
		} else {
			tempPwd.value = tempPwd.value.replace(allowReg, '')
		}
	}
	// 复制加密链接
	const copyEncryptUrl = () => {
		uni.setClipboardData({
			data: link.value,
			success: () => {
				toastRef.value.showToast('复制成功')
			}
		})
	}


	// 发送wifi配置
	const sendWifiInfo = async () => {
		send_flag = true
		if (tempSsid.value.length < 3 || tempPwd.value.length < 8) {
			toastRef.value.show('WiFi名称或密码过短')
			return
		}
		closeWifiDialog()
		await store.control('5' + tempSsid.value + '$' + tempPwd.value)
		if (store.isSucceed) {
			store.self_ssid = tempSsid.value
			store.self_pwd = tempPwd.value
			toastRef.value.show('修改WiFi配置成功')
		} else {
			toastRef.value.show('修改WiFi配置失败')
		}
		send_flag = false
	}

	let calibrate_flag = false
	// 设备校准按钮事件
	const deviceCalibrate = async () => {
		if (calibrate_flag) {
			toastRef.value.show('正在校准，请等待...')
			return
		}
		uni.showModal({
			title: '设备校准',
			content: '确认开始设备校准？',
			success: async (res) => {
				if (res.confirm) {
					calibrate_flag = true
					toastRef.value.show('正在校准，请等待...')
					await store.control('6')
					if (store.isSucceed) {
						toastRef.value.show('校准成功')
					} else {
						toastRef.value.show('校准失败')
					}
					calibrate_flag = false
				}
			}
		})
	}
	// ==============================



	// 返回主界面
	function back() {
		uni.navigateBack({
			delta: 1
		})
	}
	// 清空当前页面栈，返回登陆界面
	function logout() {
		// 清理缓存数据再退出，以免影响新登录账号
		store.cleanData()
		uni.reLaunch({
			url: '/pages/login/login'
		})
	}
</script>

<style lang="scss">
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

	// =====================
	.config-wrap {
		padding: 20rpx;
		background-color: #fff;
	}

	.item-box {
		padding: 25rpx 10rpx;
	}

	.item-title {
		font-size: 32rpx;
		display: block;
		margin-bottom: 15rpx;
	}

	.item-content {
		padding-left: 10rpx;
	}

	.text-val {
		font-size: 30rpx;
		color: #333;
	}

	.tip-desc {
		font-size: 24rpx;
		color: #999;
		margin-left: 0rpx;
		display: block;
		margin-top: 8rpx;
	}

	.mt10 {
		margin-top: 20rpx;
	}

	/* 分割浅灰线 */
	.split-line {
		height: 1rpx;
		background-color: #e5e5e5;
		width: 100%;
	}

	/* ==========全局灰色按钮样式+点击反馈========== */
	.gray-btn {
		background: #cccccc !important;
		color: #333333 !important;
		border: none !important;
		border-radius: 8rpx !important;
	}

	/* 按钮按下变暗 */
	.gray-btn:active {
		background: #b3b3b3 !important;
	}

	/* ==========弹窗美化========== */
	.pop-mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.55);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.pop-box {
		width: 82%;
		background: #fff;
		border-radius: 24rpx;
		padding: 40rpx 35rpx;
	}

	.pop-item {
		margin-bottom: 35rpx;
	}

	.pop-label {
		font-size: 30rpx;
		color: #444;
		display: block;
		margin-bottom: 14rpx;
	}

	/* 加高输入框，大气样式 */
	.pop-input {
		width: 100%;
		height: 90rpx;
		border: 1rpx solid #dddddd;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 30rpx;
		background: #fafafa;
	}

	.pop-input:focus {
		border-color: #bbbbbb;
	}

	/* 发送按钮整行居中铺满 */
	.pop-btn-wrap {
		margin-top: 20rpx;
	}

	.pop-send-btn {
		width: 100% !important;
		height: 88rpx !important;
		line-height: 88rpx !important;
		background: #cccccc !important;
		color: #333 !important;
		border-radius: 12rpx !important;
		border: 0 !important;
		font-size: 32rpx;
	}

	.pop-send-btn:active {
		background: #b3b3b3 !important;
	}
</style>