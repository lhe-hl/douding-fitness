import { describe, expect, it } from 'vitest'
import { readUniLoginCode, sessionFromLoginData } from './wechat-login'

describe('readUniLoginCode', () => {
  it('从 uni.login 结果取出 code', () => {
    expect(readUniLoginCode({ code: '  wx-code  ' })).toBe('wx-code')
  })

  it('没有 code 时不发起登录', () => {
    expect(readUniLoginCode({ code: '' })).toBeNull()
    expect(readUniLoginCode({ code: '   ' })).toBeNull()
    expect(readUniLoginCode(null)).toBeNull()
    expect(readUniLoginCode(undefined)).toBeNull()
  })
})

describe('sessionFromLoginData', () => {
  it('成功响应留下 token，并带上有内容的昵称和头像', () => {
    expect(
      sessionFromLoginData({
        token: ' jwt-token ',
        user: { nickname: ' 豆丁 ', avatarUrl: ' https://example.com/a.png ' },
      }),
    ).toEqual({
      token: 'jwt-token',
      nickname: '豆丁',
      avatarUrl: 'https://example.com/a.png',
    })
  })

  it('没有 token 时不算登录，也不接受空白 token', () => {
    expect(sessionFromLoginData({ token: '   ', user: { nickname: '豆丁' } })).toBeNull()
    expect(sessionFromLoginData({ user: { nickname: '豆丁' } })).toBeNull()
    expect(sessionFromLoginData(null)).toBeNull()
  })

  it('用户字段为空时只保留 token', () => {
    expect(sessionFromLoginData({ token: 'jwt-token', user: { nickname: null, avatarUrl: '' } })).toEqual({
      token: 'jwt-token',
    })
  })
})
