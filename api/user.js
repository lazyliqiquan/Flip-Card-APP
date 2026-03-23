import request from './request'

export const loginApi = (data) => {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}