// 统一网络请求层与双拦截器封装

const BASE_URL = 'http://localhost:3000/api'
const TOKEN_KEY = 'douding_auth_token'

// 401 防抖标记，避免多个接口同时 401 弹出重复提示
let isShowing401Toast = false

export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 获取本地存储的 Token
 */
export function getToken(): string {
  try {
    return uni.getStorageSync(TOKEN_KEY) || uni.getStorageSync('token') || ''
  } catch {
    return ''
  }
}

/**
 * 存储用户 Token
 */
export function setToken(token: string): void {
  try {
    uni.setStorageSync(TOKEN_KEY, token)
    uni.setStorageSync('token', token) // 兼容历史字段
  } catch (err) {
    console.error('存储 Token 失败:', err)
  }
}

/**
 * 清除用户 Token
 */
export function clearToken(): void {
  try {
    uni.removeStorageSync(TOKEN_KEY)
    uni.removeStorageSync('token')
  } catch (err) {
    console.error('清除 Token 失败:', err)
  }
}

/**
 * 判断当前是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken()
}

/**
 * 统一网络请求核心方法 (含请求拦截与响应拦截)
 */
export function request<T = any>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    // ---------------------- 1. 请求拦截器 ----------------------
    const token = getToken()
    const requestHeader: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.header,
    }

    // 只要有 Token 就自动拼装 Bearer 头
    if (token) {
      requestHeader.Authorization = `Bearer ${token}`
    }

    const fullUrl = options.url.startsWith('http')
      ? options.url
      : `${BASE_URL}${options.url.startsWith('/') ? options.url : `/${options.url}`}`

    // ---------------------- 2. 执行网络请求 ----------------------
    uni.request({
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data,
      header: requestHeader,

      // ---------------------- 3. 响应拦截器 ----------------------
      success: (res) => {
        const { statusCode, data } = res

        // (1) HTTP 401 拦截：登录已失效
        if (statusCode === 401 || (data && (data as any).code === 401)) {
          clearToken()
          if (!isShowing401Toast) {
            isShowing401Toast = true
            uni.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none',
              duration: 2500,
            })
            setTimeout(() => {
              isShowing401Toast = false
            }, 3000)
          }
          return reject(data)
        }

        // (2) HTTP 成功范围 (200 - 299)
        if (statusCode >= 200 && statusCode < 300) {
          const resData = data as any

          // 业务状态码规范解包
          if (resData && typeof resData === 'object' && 'code' in resData) {
            if (resData.code === 200) {
              // 自动解包 data 字段供前端直接使用
              return resolve(resData.data as T)
            } else {
              // 业务报错自动 Toast 提示
              uni.showToast({
                title: resData.message || '业务请求失败',
                icon: 'none',
              })
              return reject(resData)
            }
          }

          // 非标准结构直接返回 raw 数据
          return resolve(resData as T)
        }

        // (3) 其余 HTTP 异常错误 (400, 403, 404, 500 等)
        const errMsg = (data as any)?.message || `请求错误 (HTTP ${statusCode})`
        uni.showToast({
          title: errMsg,
          icon: 'none',
        })
        reject(data)
      },

      // 网络链路彻底失败 (断网 / 跨域 / 域名无法访问)
      fail: (err) => {
        uni.showToast({
          title: '服务器连接异常，请检查网络',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
