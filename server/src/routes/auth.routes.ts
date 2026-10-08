import { Router } from 'express';
import { devLogin, wechatLogin } from '../controllers/auth.controller';

const router = Router();

// 开发测试登录
router.post('/dev-login', devLogin);

// 微信真机登录
router.post('/wechat-login', wechatLogin);

export default router;
