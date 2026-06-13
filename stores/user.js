import {
	defineStore
} from 'pinia'
import Request from '@/utils/request'
const api = new Request();

export const useUserStore = defineStore('user', {
	state: () => ({
		username: '',
		isRoot: false,
		isSucceed: false,
		singleUser: [],
		user_list: []
	}),
	actions: {
		// =============登陆======================
		async login() {
			this.isSucceed = false
			await api.post('/user/login', {
				'username': this.username
			}).then(res => {
				if (res.code === 0) {
					console.log(res)
					// 登陆成功，说明当前加密链接是有效的,可以存储到本地了
					uni.setStorageSync('username', this.username)
					uni.setStorageSync('url', Request.url)
					this.isRoot = res.isRoot
					uni.reLaunch({
						url: '/pages/home/home'
					})
				}
			})
		},
		// =============创建用户======================
		async createUser(username) {
			this.isSucceed = false
			await api.post('/user/create', {
				'username': username
			}).then(res => {
				if (res.code === 0) {
					console.log(res)
					this.isSucceed = true
				}
			})
		},
		// ===========获取指定用户信息=============
		async getUserInfo(username) {
			this.isSucceed = false
			await api.get(`/user/info/${username}`).then(res => {
				if (res.code === 0) {
					console.log(res)
					this.singleUser = res.user_info ? [res.user_info] : []
					this.isSucceed = true
				}
			})
		},
		// ============删除指定用户=================
		async deleteUser(username) {
			this.isSucceed = false
			await api.get(`/user/delete/${username}`).then(res => {
				if (res.code === 0) {
					this.isSucceed = true
				}
			})
		},
		// =================获取所有用户信息==============
		async getAllUsers() {
			this.isSucceed = false
			await api.get('/user/all').then(res => {
				if (res.code === 0) {
					console.log(res)
					this.user_list = res.users ?? []
					console.log(this.user_list)
					this.isSucceed = true
				}
			})
		}
	}
})