import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  userId: string;
}

const JWT_SECRET = config.jwtSecret || 'douding-fitness-secret-key-2026';
const JWT_EXPIRES_IN = '7d';

/**
 * 签发用户 JWT Token
 * @param payload 用户 ID 负载
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * 校验并解析 JWT Token
 * @param token Bearer Token 字符串
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
