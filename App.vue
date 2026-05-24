<script setup>
	import {
		onLaunch
	} from "@dcloudio/uni-app";
	import {
		useUserStore
	} from '@/stores/user';
	// import {
	// 		aesDecrypt,
	// 		aesEncrypt
	// 	} from '@/utils/crypto'
	import Request from '@/utils/request.js';
	onLaunch(async () => {
		// const m = aesEncrypt('liqiquan#liqiquan#http://192.168.1.30:8000')
		// console.log(m)
		console.log('APP启动成功');
		// 启动时读取本地存储的数据
		const store = useUserStore()
		store.username = uni.getStorageSync('username')
		store.password = uni.getStorageSync('password')
		const url = uni.getStorageSync('url')
		// 设置网络服务器的IP:port
		Request.init(url)
		await store.login()
	})
</script>

<style>
	/*每个页面公共css */
	@import url("@/static/iconfont/iconfont.css");
</style>