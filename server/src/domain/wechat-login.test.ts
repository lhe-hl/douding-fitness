import { describe, expect, it } from 'vitest';
import { signToken, verifyToken } from '../utils/jwt';
import {
  readLoginCode,
  resolveWechatCredentials,
  scrubSecret,
  userFromCode2Session,
} from './wechat-login';

const MISSING_SECRET_MESSAGE =
  '未配置微信 AppID 或 AppSecret（环境变量 WX_APPID、WX_SECRET）。本地没有密钥时请调用 /api/auth/dev-login';

describe('readLoginCode', () => {
  it('去掉空白后留下 code', () => {
    expect(readLoginCode('  abc123  ')).toBe('abc123');
  });

  it('空字符串和非字符串都不是 code', () => {
    expect(readLoginCode('')).toBeNull();
    expect(readLoginCode('   ')).toBeNull();
    expect(readLoginCode(undefined)).toBeNull();
    expect(readLoginCode(123)).toBeNull();
  });
});

describe('resolveWechatCredentials', () => {
  it('没有 AppSecret 时返回 503，不编造 openid', () => {
    const result = resolveWechatCredentials('wx606fc804e012e441', '   ');
    expect(result).toEqual({
      ok: false,
      httpStatus: 503,
      message: MISSING_SECRET_MESSAGE,
    });
    expect(result).not.toHaveProperty('openid');
  });

  it('没有 AppID 时同样失败，文案不回显密钥', () => {
    const secret = 'local-test-secret-value';
    const result = resolveWechatCredentials('  ', secret);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe(MISSING_SECRET_MESSAGE);
      expect(result.message).not.toContain(secret);
    }
  });

  it('AppID 和 AppSecret 都有时通过，并去掉首尾空白', () => {
    expect(resolveWechatCredentials('  wx606fc804e012e441  ', '  secret-value  ')).toEqual({
      ok: true,
      appId: 'wx606fc804e012e441',
      appSecret: 'secret-value',
    });
  });
});

describe('userFromCode2Session', () => {
  it('成功结果只留下 openid 和默认昵称，不保存 session_key', () => {
    const result = userFromCode2Session({
      openid: 'openid-1',
      session_key: 'session-key-value',
      unionid: 'union-1',
    });
    expect(result).toEqual({
      ok: true,
      user: { openid: 'openid-1', nickname: '微信用户' },
    });
    expect(JSON.stringify(result)).not.toContain('session-key-value');
    expect(JSON.stringify(result)).not.toContain('union-1');
  });

  it('errcode 为 0 且有 openid 时仍算成功', () => {
    expect(userFromCode2Session({ errcode: 0, openid: 'openid-2' })).toEqual({
      ok: true,
      user: { openid: 'openid-2', nickname: '微信用户' },
    });
  });

  it('微信拒绝错误密钥时给出明确错误，即使夹带 openid 也不采用', () => {
    const result = userFromCode2Session({
      errcode: 40125,
      errmsg: 'invalid appsecret',
      openid: 'should-not-use',
    });
    expect(result).toEqual({
      ok: false,
      httpStatus: 400,
      message: '微信拒绝了这次登录（40125）：invalid appsecret',
    });
  });

  it('无效 code 同样拒绝', () => {
    expect(userFromCode2Session({ errcode: 40029, errmsg: 'invalid code' })).toEqual({
      ok: false,
      httpStatus: 400,
      message: '微信拒绝了这次登录（40029）：invalid code',
    });
  });

  it('只有 errcode 没有 errmsg 时仍说明错误码', () => {
    expect(userFromCode2Session({ errcode: -1 })).toEqual({
      ok: false,
      httpStatus: 400,
      message: '微信拒绝了这次登录（-1）',
    });
  });

  it('没有 openid 时失败', () => {
    expect(userFromCode2Session({ errmsg: 'ok' })).toEqual({
      ok: false,
      httpStatus: 400,
      message: '微信没有返回 openid，登录未完成',
    });
    expect(userFromCode2Session({ openid: '   ' }).ok).toBe(false);
  });

  it('不是对象的响应无法登录', () => {
    expect(userFromCode2Session(null)).toEqual({
      ok: false,
      httpStatus: 400,
      message: '微信返回了无法识别的登录结果',
    });
    expect(userFromCode2Session(['openid-1']).ok).toBe(false);
  });
});

describe('scrubSecret', () => {
  it('把文案里的密钥换成占位，短字符串不动', () => {
    expect(scrubSecret('invalid appsecret: local-test-secret', 'local-test-secret')).toBe(
      'invalid appsecret: ***',
    );
    expect(scrubSecret('invalid appsecret', 'short')).toBe('invalid appsecret');
    expect(scrubSecret('plain', '')).toBe('plain');
  });
});

describe('signToken', () => {
  it('用户 id 签出的 JWT 能解回同一个 userId', () => {
    const token = signToken({ userId: 'user-1' });
    expect(verifyToken(token)?.userId).toBe('user-1');
  });

  it('签名不符时拒绝，且不断言密钥本身', () => {
    expect(verifyToken('not-a-jwt')).toBeNull();
    const token = signToken({ userId: 'user-1' });
    expect(verifyToken(`${token}x`)).toBeNull();
  });
});
