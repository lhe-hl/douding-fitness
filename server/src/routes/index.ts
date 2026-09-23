import { Router, Request, Response } from 'express';

const router = Router();

// 健康检查路由
router.get('/health', (req: Request, res: Response) => {
  res.json({
    code: 200,
    message: '豆丁健身后端服务运行正常',
    timestamp: new Date().toISOString(),
  });
});

export default router;
