export interface WechatPublicUser {
  id: string;
  openid: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: number | null;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
}

export interface WechatLoginSuccessData {
  token: string;
  user: WechatPublicUser;
}

export interface WechatUserSeed {
  openid: string;
  nickname: string;
}

export type WechatCredentialCheck =
  | { ok: true; appId: string; appSecret: string }
  | { ok: false; httpStatus: 503; message: string };

export type Code2SessionUserResult =
  | { ok: true; user: WechatUserSeed }
  | { ok: false; httpStatus: 400; message: string };
