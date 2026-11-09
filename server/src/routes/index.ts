import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import workoutRoutes from './workout.routes';

const router = Router();

// 健康检查路由
router.get('/health', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '豆丁健身后端服务运行正常',
    timestamp: new Date().toISOString(),
  });
});

// 鉴权与登录路由 (/api/auth)
router.use('/auth', authRoutes);

// 健身打卡记录路由 (/api/workout)
router.use('/workout', workoutRoutes);

export default router;
