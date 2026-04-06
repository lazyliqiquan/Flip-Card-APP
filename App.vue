<script setup>
	import {
		onLaunch
	} from "@dcloudio/uni-app";
	import {
		useUserStore
	} from '@/stores/user';
	import LocalStorage from '@/utils/store.js';
	import Request from '@/utils/request.js';
	onLaunch(() => {
		console.log('APP启动成功');
		// 启动时读取本地存储的数据
		const store = useUserStore()
		const storage = new LocalStorage()
		const username = storage.get('username')
		const password = storage.get('password')
		const url = storage.get('url')
		// 设置网络服务器的IP:port
		Request.init(url)
		store.username = username
		store.password = password
		store.login()
	})
</script>

<style>
	/*每个页面公共css */
	@import url("@/static/iconfont/iconfont.css");
</style>