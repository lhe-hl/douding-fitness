// 通用响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 基础用户信息
export interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatarUrl: string
  gender: number
  height?: number
  weight?: number
  targetWeight?: number
}
