import { Request, Response } from 'express';
import { signToken } from '../utils/jwt';
import { prisma } from '../prisma';
import { loginWithWechatCode, WechatLoginError } from '../services/wechat-auth.service';

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
 * 微信小程序登录：code 换 openid，在共用 User 表查找或创建一行，签发 JWT。
 * 未配置 AppSecret 或微信拒绝时返回明确错误，不编造 openid。
 */
export async function wechatLogin(req: Request, res: Response) {
  try {
    const data = await loginWithWechatCode(req.body?.code);
    return res.json({
      code: 200,
      message: '微信登录成功',
      data,
    });
  } catch (error) {
    if (error instanceof WechatLoginError) {
      return res.status(error.httpStatus).json({
        code: error.httpStatus,
        message: error.message,
      });
    }
    const name = error instanceof Error ? error.name : 'Error';
    console.error(`[wechat-login] 登录失败: ${name}`);
    return res.status(500).json({
      code: 500,
      message: '微信登录失败',
    });
  }
}
