export interface AuthUser {
  id: string
  openid: string
  nickname: string | null
  avatarUrl: string | null
  gender: number | null
  height: number | null
  weight: number | null
  targetWeight: number | null
}

export interface WechatLoginData {
  token: string
  user: AuthUser
}

export interface LoginSession {
  token: string
  nickname?: string
  avatarUrl?: string
}
