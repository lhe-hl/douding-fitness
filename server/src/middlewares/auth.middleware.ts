import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * JWT 鉴权拦截中间件
 * 从请求头 Authorization: Bearer <token> 提取并校验用户身份
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未登录或认证令牌格式错误 (需要 Bearer Token)',
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload || !payload.userId) {
    return res.status(401).json({
      code: 401,
      message: '登录状态已失效，请重新登录',
    });
  }

  // 将解析出的 userId 挂载到 req 对象上，下游业务 Controller 随时使用
  req.userId = payload.userId;
  next();
}
