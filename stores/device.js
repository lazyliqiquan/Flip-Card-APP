import {
	defineStore
} from 'pinia'
import Request from '@/utils/request'
const api = new Request();

export const useDeviceStore = defineStore('device', {
	state: () => ({
		model: -1,

	}),
	actions: {}
})