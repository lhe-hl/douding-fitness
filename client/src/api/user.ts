import type { WechatLoginData } from '../types/auth'
import { request, setToken } from './request'

// 开发模式一键登录 (换取测试用户 Token)
export async function loginDev(userId: string = 'test-user-001') {
  const data = await request<{ token: string; user: any }>({
    url: '/auth/dev-login',
    method: 'POST',
    data: { userId },
    skipSession: true,
  })
  if (data?.token) {
    setToken(data.token)
  }
  return data
}

// 微信 code 换 JWT，并写入 douding_auth_token
export async function loginWithWechat(code: string, options?: { silent?: boolean }) {
  const data = await request<WechatLoginData>({
    url: '/auth/wechat-login',
    method: 'POST',
    data: { code },
    silent: options?.silent,
    skipSession: true,
  })
  if (data?.token) {
    setToken(data.token)
  }
  return data
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
