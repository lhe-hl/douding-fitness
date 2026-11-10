import { getToken } from '../api/request'
import { loginWithWechat } from '../api/user'
import { readUniLoginCode, sessionFromLoginData } from '../domain/wechat-login'
import type { LoginSession } from '../types/auth'
import { useUserStore } from '../stores/user'

let pending: Promise<void> | null = null

export function ensureWechatLogin(): Promise<void> {
  if (!pending) pending = run()
  return pending
}

function requestWxCode(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof uni === 'undefined' || typeof uni.login !== 'function') {
      resolve(null)
      return
    }
    uni.login({
      provider: 'weixin',
      success: (result) => resolve(readUniLoginCode(result)),
      fail: () => resolve(null),
    })
  })
}

async function run(): Promise<void> {
  const existing = getToken()
  let session: LoginSession | null = null
  try {
    const code = await requestWxCode()
    if (code) {
      const data = await loginWithWechat(code, { silent: true })
      session = sessionFromLoginData(data)
    }
  } catch {
    session = null
  }

  try {
    const store = useUserStore()
    if (session) store.applyLogin(session)
    else if (existing) store.setToken(existing)
  } catch {
    // token 已写入本地存储。Pinia 尚未就绪时，后续请求仍从 douding_auth_token 读取。
  }
}
