import { request, setToken } from './request'

// 开发模式一键登录 (换取测试用户 Token)
export async function loginDev(userId: string = 'test-user-001') {
  const data = await request<{ token: string; user: any }>({
    url: '/auth/dev-login',
    method: 'POST',
    data: { userId },
  })
  if (data?.token) {
    setToken(data.token)
  }
  return data
}

// 微信真实登录换取 JWT
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
