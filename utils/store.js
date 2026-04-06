import {
	aesEncrypt,
	aesDecrypt
} from "./crypto";
/**
 * 本地存储工具类（永久存储，无过期时间）
 * 基于 localStorage，自动处理对象/数组/基本类型
 */
class LocalStorage {
	/**
	 * 存储数据
	 * @param {string} key - 键名
	 * @param {string} value - 值（支持对象、数组、字符串等）
	 */
	set(key, value) {
		try {
			const m = aesEncrypt(JSON.stringify(value));
			localStorage.setItem(key, m);
			return true;
		} catch (error) {
			console.error('存储失败：', error);
			return false;
		}
	}

	/**
	 * 获取数据
	 * @param {string} key - 键名
	 * @param {string} defaultValue - 取不到时返回的默认值
	 * @returns {string}
	 */
	get(key, defaultValue = '') {
		try {
			let item = localStorage.getItem(key);
			item = aesDecrypt(item);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error('获取失败：', error);
			return '';
		}
	}

	/**
	 * 删除指定数据
	 * @param {string} key
	 */
	remove(key) {
		try {
			localStorage.removeItem(key);
			return true;
		} catch (error) {
			console.error('删除失败：', error);
			return false;
		}
	}

	/**
	 * 清空所有存储
	 */
	clear() {
		try {
			localStorage.clear();
			return true;
		} catch (error) {
			console.error('清空失败：', error);
			return false;
		}
	}

	/**
	 * 获取所有键名
	 * @returns {string[]}
	 */
	keys() {
		return Object.keys(localStorage);
	}

	/**
	 * 判断是否存在某个键
	 * @param {string} key
	 * @returns {boolean}
	 */
	has(key) {
		return this.get(key) !== null;
	}
}

// 导出类，供项目任意地方使用
export default LocalStorage;