import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as workoutController from '../controllers/workout.controller';

const router = Router();

// 挂载全局 JWT 鉴权中间件保护所有打卡接口
router.use(authMiddleware);

// 1. 获取指定月份的训练打卡摘要列表 (日历渲染)
router.get('/month', workoutController.getMonthWorkout);

// 2. 获取某一天的详细训练记录 (详情卡片)
router.get('/day', workoutController.getDayWorkout);

// 3. 提交/更新单日训练打卡 (新增与编辑)
router.post('/', workoutController.saveWorkout);

// 4. 删除指定训练记录
router.delete('/:id', workoutController.deleteWorkout);

export default router;
