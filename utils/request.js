// const baseUrl = "https://uapis.cn/api/v1/misc/weather?city=北京"; // 你的公网IP
// export let baseUrl = "http://192.168.1.30:8000"; // 你的公网IP

class Request {
	// 静态成员 url，所有实例共享
	static url = '';

	static init(url) {
		this.url = url
	}

	/**
	 * 通用请求
	 * @param {string} path 接口路径
	 * @param {string} method
	 * @param {object} data
	 * @param {object} header
	 * @returns {Promise<any>}
	 */
	request(path, method = 'GET', data = {}, header = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: Request.url + path,
				method,
				data,
				header: {
					'Content-Type': 'application/json',
					...header
				},
				success: res => {
					resolve(res.data);
				},
				fail: err => {
					reject(err);
				}
			});
		});
	}

	get(path, data = {}, header = {}) {
		return this.request(path, 'GET', data, header);
	}

	post(path, data = {}, header = {}) {
		return this.request(path, 'POST', data, header);
	}

	put(path, data = {}, header = {}) {
		return this.request(path, 'PUT', data, header);
	}

	delete(path, data = {}, header = {}) {
		return this.request(path, 'DELETE', data, header);
	}
}

// 导出类
export default Request;