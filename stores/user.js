import {
	defineStore
} from 'pinia'
import Request from '@/utils/request'
const api = new Request();

export const useUserStore = defineStore('user', {
	state: () => ({
		username: '',
		password: '',
		isRoot: false,
		isLogin: false
	}),
	actions: {
		async login() {
			api.post('/user/login', {
				'username': this.username,
				'password': this.password
			}).then(res => {
				if (res.code === 0) {
					console.log(res)
					// 登陆成功，说明当前加密链接是有效的,可以存储到本地了
					uni.setStorageSync('username', this.username)
					uni.setStorageSync('password', this.password)
					uni.setStorageSync('url', Request.url)
					this.isRoot = res.isRoot
					this.isLogin = true
					uni.redirectTo({
						url: '/pages/home/home'
					})
					return true
				}
			})
		}
	}
})