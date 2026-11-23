import {
	defineStore
} from 'pinia'
import Request from '@/utils/request'
import {
	useUserStore
} from '@/stores/user'

export const useDeviceStore = defineStore('device', {
	state: () => ({
		model: -1,
		futureModel: -1,
		isSucceed: false,
		self_ssid: '',
		self_pwd: '',
		device_reply: ''
	}),
	actions: {
		// 清理缓存数据再退出，以免影响新登录账号
		cleanData() {
			this.model = -1
			this.futureModel = -1
			this.isSucceed = false
			this.self_ssid = ''
			this.self_pwd = ''
			this.device_reply = ''

		},
		async control(cmd) {
			this.isSucceed = false
			const api = new Request();
			const userStore = useUserStore();
			console.log(cmd)
			await api.post('/device/control', {
				device_id: userStore.singleUser.length === 0 ? userStore.username : userStore
					.singleUser[0].username,
				cmd: cmd
			}).then(res => {
				console.log(res)
				if (res.code === 0) {
					this.model = Number(res.msg[0])
					this.device_reply = res.msg.slice(1)
					if (cmd == '4') {
						let info = String(res.msg).split('$')
						this.self_ssid = info[0].slice(1)
						this.self_pwd = info[1]
						this.isSucceed = true
					} else if (cmd[0] == '7') {
						this.isSucceed = true
					} else {
						this.isSucceed = (res.msg[1] == '0')
					}
				}
			})
		}
	}
})