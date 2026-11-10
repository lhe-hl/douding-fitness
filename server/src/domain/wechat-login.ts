import type { Code2SessionUserResult, WechatCredentialCheck } from '../types/wechat-login';

const MISSING_CREDENTIALS_MESSAGE =
  '未配置微信 AppID 或 AppSecret（环境变量 WX_APPID、WX_SECRET）。本地没有密钥时请调用 /api/auth/dev-login';

export function readLoginCode(code: unknown): string | null {
  if (typeof code !== 'string') return null;
  const trimmed = code.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveWechatCredentials(appId: string, appSecret: string): WechatCredentialCheck {
  const id = appId.trim();
  const secret = appSecret.trim();
  if (!id || !secret) {
    return { ok: false, httpStatus: 503, message: MISSING_CREDENTIALS_MESSAGE };
  }
  return { ok: true, appId: id, appSecret: secret };
}

function readErrcode(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return undefined;
}

function readText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function userFromCode2Session(body: unknown): Code2SessionUserResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, httpStatus: 400, message: '微信返回了无法识别的登录结果' };
  }

  const record = body as { openid?: unknown; errcode?: unknown; errmsg?: unknown };
  const errcode = readErrcode(record.errcode);
  if (errcode !== undefined && errcode !== 0) {
    const errmsg = readText(record.errmsg);
    const message = errmsg
      ? `微信拒绝了这次登录（${errcode}）：${errmsg}`
      : `微信拒绝了这次登录（${errcode}）`;
    return { ok: false, httpStatus: 400, message };
  }

  const openid = readText(record.openid);
  if (!openid) {
    return { ok: false, httpStatus: 400, message: '微信没有返回 openid，登录未完成' };
  }

  return {
    ok: true,
    user: {
      openid,
      nickname: '微信用户',
    },
  };
}

export function scrubSecret(message: string, secret: string): string {
  const value = secret.trim();
  if (value.length < 8) return message;
  return message.split(value).join('***');
}
