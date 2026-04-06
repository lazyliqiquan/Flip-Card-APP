// 引入加密库
import CryptoJS from 'crypto-js';

/**
 * 注意：密钥和偏移量必须前后端/双方保持一致！
 * AES-128 要求：密钥(key) 16位字符，偏移量(iv) 16位字符
 */
const SECRET_KEY = '7s9K2pR5xQ8bZ1vG';
const SECRET_IV = 'dF3hJ6nL0tU7mC4e';

/**
 * AES 对称加密
 * @param {String} text 明文（要加密的文本）
 * @returns {String} 密文
 */
export function aesEncrypt(text) {
  // 处理文本编码
  const srcs = CryptoJS.enc.Utf8.parse(text);
  // AES 加密
  const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
    iv: CryptoJS.enc.Utf8.parse(SECRET_IV),
    mode: CryptoJS.mode.CBC,       // 模式
    padding: CryptoJS.pad.Pkcs7    // 填充方式
  });
  // 返回Base64格式密文（通用传输格式）
  return encrypted.toString();
}

/**
 * AES 对称解密
 * @param {String} cipherText 密文
 * @returns {String} 明文
 */
export function aesDecrypt(cipherText) {
  try {
    // AES 解密
    const decrypt = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      iv: CryptoJS.enc.Utf8.parse(SECRET_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    // 转换为字符串
    return decrypt.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('解密失败：密钥/偏移量错误或密文被篡改', error);
    return '';
  }
}