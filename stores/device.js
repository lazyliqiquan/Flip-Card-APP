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
		isSucceed: true,
		codeList: ['', '', '', '', '']
	}),
	actions: {
		async control(cmd) {
			this.isSucceed = false
			const api = new Request();
			const userStore = useUserStore();
			await api.post('/device/control', {
				device_id: userStore.username,
				cmd: cmd
			}).then(res => {
				console.log(res)
				if (res.code === 0) {
					this.isSucceed = true
					this.model = Number(res.msg[0])
					console.log(this.model)
				}
			})
		}
	}
})