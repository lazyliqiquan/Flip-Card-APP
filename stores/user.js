import {
	defineStore
} from 'pinia'
import Request from '@/utils/request'
import LocalStorage from '@/utils/store';
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
				if (res['code'] === 0) {
					console.log(res)
					// 登陆成功，说明当前加密链接是有效的,可以存储到本地了
					const storage = new LocalStorage()
					storage.set('username', this.username)
					storage.set('password', this.password)
					storage.set('url', Request.url)
					this.isRoot = res['isRoot']
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