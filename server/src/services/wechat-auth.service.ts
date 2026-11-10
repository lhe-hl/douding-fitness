import { config } from '../config';
import { prisma } from '../prisma';
import {
  readLoginCode,
  resolveWechatCredentials,
  scrubSecret,
  userFromCode2Session,
} from '../domain/wechat-login';
import type { WechatLoginSuccessData, WechatPublicUser } from '../types/wechat-login';
import { signToken } from '../utils/jwt';

const CODE2SESSION_ENDPOINT = 'https://api.weixin.qq.com/sns/jscode2session';
const UPSTREAM_MESSAGE = '微信登录服务暂不可用，请稍后再试';

const publicUserSelect = {
  id: true,
  openid: true,
  nickname: true,
  avatarUrl: true,
  gender: true,
  height: true,
  weight: true,
  targetWeight: true,
} as const;

export class WechatLoginError extends Error {
  readonly httpStatus: 400 | 502 | 503;

  constructor(httpStatus: 400 | 502 | 503, message: string) {
    super(message);
    this.name = 'WechatLoginError';
    this.httpStatus = httpStatus;
  }
}

async function fetchCode2Session(appId: string, appSecret: string, code: string): Promise<unknown> {
  const url = new URL(CODE2SESSION_ENDPOINT);
  url.searchParams.set('appid', appId);
  url.searchParams.set('secret', appSecret);
  url.searchParams.set('js_code', code);
  url.searchParams.set('grant_type', 'authorization_code');

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new WechatLoginError(502, UPSTREAM_MESSAGE);
  }

  if (response.status !== 200) {
    throw new WechatLoginError(502, UPSTREAM_MESSAGE);
  }

  try {
    return await response.json();
  } catch {
    throw new WechatLoginError(502, UPSTREAM_MESSAGE);
  }
}

export async function loginWithWechatCode(code: unknown): Promise<WechatLoginSuccessData> {
  const loginCode = readLoginCode(code);
  if (!loginCode) {
    throw new WechatLoginError(400, '缺少微信 code 参数');
  }

  const credentials = resolveWechatCredentials(config.wechat.appId, config.wechat.appSecret);
  if (!credentials.ok) {
    throw new WechatLoginError(credentials.httpStatus, credentials.message);
  }

  const body = await fetchCode2Session(credentials.appId, credentials.appSecret, loginCode);
  const parsed = userFromCode2Session(body);
  if (!parsed.ok) {
    throw new WechatLoginError(
      parsed.httpStatus,
      scrubSecret(parsed.message, credentials.appSecret),
    );
  }

  const user: WechatPublicUser = await prisma.user.upsert({
    where: { openid: parsed.user.openid },
    update: {},
    create: {
      openid: parsed.user.openid,
      nickname: parsed.user.nickname,
    },
    select: publicUserSelect,
  });

  return {
    token: signToken({ userId: user.id }),
    user,
  };
}
