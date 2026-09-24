import { request } from './request'

// 微信登录换取 JWT
export function loginWithWechat(code: string) {
  return request({
    url: '/auth/wechat-login',
    method: 'POST',
    data: { code },
  })
}

// 获取用户身体档案
export function getUserProfile() {
  return request({
    url: '/user/profile',
    method: 'GET',
  })
}

// 更新用户身体档案
export function updateUserProfile(data: any) {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data,
  })
}
