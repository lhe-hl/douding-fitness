import { Request, Response } from 'express';
import { signToken } from '../utils/jwt';
import { prisma } from '../prisma';

/**
 * 1. 开发/测试登录接口
 * 供开发阶段、前端或 Apifox 一键换取指定测试账号的真实有效 Token
 */
export async function devLogin(req: Request, res: Response) {
  const targetUserId = req.body.userId || 'test-user-001';

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!user) {
    return res.status(404).json({
      code: 404,
      message: '测试用户不存在，请先运行 pnpm prisma:seed 初始化测试账号',
    });
  }

  const token = signToken({ userId: user.id });

  return res.json({
    code: 200,
    message: '开发模式登录成功',
    data: {
      token,
      user,
    },
  });
}

/**
 * 2. 真实微信登录接口 (预留架构，后续填补微信 code2session 逻辑)
 */
export async function wechatLogin(req: Request, res: Response) {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      code: 400,
      message: '缺少微信 code 参数',
    });
  }

  // TODO: 后续接入真实微信 code 换取 openid:
  // 1. 请求 https://api.weixin.qq.com/sns/jscode2session?appid=...&secret=...&js_code=${code}&grant_type=authorization_code
  // 2. prisma.user.upsert 查找或创建用户
  // 3. signToken({ userId: user.id })
  return res.status(501).json({
    code: 501,
    message: '微信真机登录接口待填入 AppSecret 后启用，开发阶段请调用 /api/auth/dev-login',
  });
}
