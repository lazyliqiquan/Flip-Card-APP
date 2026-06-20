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
		<!-- 2. 创建新用户 -->
		<view class="module-card">
			<input class="full-input" v-model="createName" placeholder="请输入用户名（仅字母、下划线）"
				@input="formatInput('create')" />
			<button class="full-btn mt-space" @click="submitCreate">创建用户</button>
		</view>

		<!-- 3. 查找指定用户 -->
		<view class="module-card">
			<input class="full-input" v-model="searchName" placeholder="请输入用户名（仅字母、下划线）"
				@input="formatInput('search')" />
			<button class="full-btn mt-space" @click="searchSingleUser">查询用户</button>
			<!-- 用户信息展示区 -->
			<view v-if="store.singleUser.length" class="info-panel mt-space">
				<text class="info-item">用户名：{{ store.singleUser[0].username }}</text>
				<text class="info-item">登录时间：{{ store.singleUser[0].login_time || '暂无登录记录' }}</text>
				<button class="full-btn mt-space" @click="copyUserLink">复制该用户加密链接</button>
			</view>
		</view>

		<!-- 4. 删除指定用户 -->
		<view class="module-card">
			<input class="full-input" v-model="deleteName" placeholder="请输入用户名（仅字母、下划线）"
				@input="formatInput('delete')" />
			<button class="full-btn mt-space" @click="submitDelete">删除用户</button>
		</view>

		<!-- 5. 查找所有用户 -->
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
		aesEncrypt
	} from '@/utils/crypto'
	import Request from '@/utils/request'
	const store = useUserStore()

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

	// 弹窗状态
	const showAllUserBox = ref(false)

	// 表单数据
	const createName = ref('')
	const deleteName = ref('')
	const searchName = ref('')

	// 正则：仅允许大小写字母 + 下划线
	const reg = /[^A-Za-z_]/g

	// 输入过滤，自动剔除非法字符
	const formatInput = (type) => {
		switch (type) {
			case 'create':
				createName.value = createName.value.replace(reg, '')
				break
			case 'delete':
				deleteName.value = deleteName.value.replace(reg, '')
				break
			case 'search':
				searchName.value = searchName.value.replace(reg, '')
				break
		}
	}

	// 创建用户（纯前端占位，自行对接接口）
	const submitCreate = async () => {
		const name = createName.value.trim()
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
		createName.value = ''
	}

	// 删除用户（纯前端占位，自行对接接口）
	const submitDelete = async () => {
		const name = deleteName.value.trim()
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
		deleteName.value = ''
	}
	// 复制指定用户的设备加密链接
	function copyUserLink() {
		uni.setClipboardData({
			data: aesEncrypt(`${store.singleUser[0].username}#${Request.url}`),
			success: () => {
				toastRef.value.show('复制成功')
			}
		})
	}

	// 查找单个用户（纯前端占位，自行对接接口）
	const searchSingleUser = async () => {
		const name = searchName.value.trim()
		if (!name) {
			uni.showToast({
				title: '请输入用户名',
				icon: 'none'
			})
			return
		}
		await store.getUserInfo(name)
		if (store.isSucceed) {
			toastRef.value.show('查询用户成功')
		} else {
			toastRef.value.show('查询用户失败')
		}
	}

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
</style>