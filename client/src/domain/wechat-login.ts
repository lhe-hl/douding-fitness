import type { LoginSession } from '../types/auth'

export function readUniLoginCode(result: { code?: unknown } | null | undefined): string | null {
  if (!result || typeof result.code !== 'string') return null
  const code = result.code.trim()
  return code.length > 0 ? code : null
}

export function sessionFromLoginData(data: unknown): LoginSession | null {
  if (!data || typeof data !== 'object') return null
  const record = data as { token?: unknown; user?: unknown }
  if (typeof record.token !== 'string') return null
  const token = record.token.trim()
  if (!token) return null

  const user =
    record.user && typeof record.user === 'object'
      ? (record.user as { nickname?: unknown; avatarUrl?: unknown })
      : undefined
  const nickname = typeof user?.nickname === 'string' ? user.nickname.trim() : ''
  const avatarUrl = typeof user?.avatarUrl === 'string' ? user.avatarUrl.trim() : ''

  return {
    token,
    ...(nickname ? { nickname } : {}),
    ...(avatarUrl ? { avatarUrl } : {}),
  }
}
