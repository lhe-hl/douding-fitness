import { Request, Response, NextFunction } from 'express';
import * as workoutService from '../services/workout.service';

/**
 * 1. 获取指定月份的训练打卡摘要列表 (日历渲染)
 * GET /api/workout/month?year=2026&month=10
 */
export async function getMonthWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const year = parseInt(req.query.year as string, 10);
    const month = parseInt(req.query.month as string, 10);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        code: 400,
        message: '参数错误: year 或 month 不合法 (如 ?year=2026&month=10)',
      });
    }

    const data = await workoutService.getMonthOverview(userId, year, month);

    return res.json({
      code: 200,
      message: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 2. 获取某一天的详细训练记录 (详情卡片)
 * GET /api/workout/day?date=2026-10-08
 */
export async function getDayWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const date = req.query.date as string;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        code: 400,
        message: '参数错误: date 必须为 YYYY-MM-DD 格式 (如 ?date=2026-10-08)',
      });
    }

    const data = await workoutService.getDayDetail(userId, date);

    return res.json({
      code: 200,
      message: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 3. 提交/更新单日训练打卡 (新增与编辑)
 * POST /api/workout
 */
export async function saveWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { date, duration, bodyParts, notes, exercises } = req.body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        code: 400,
        message: '参数错误: date 必须为 YYYY-MM-DD 格式',
      });
    }

    if (typeof duration !== 'number' || duration <= 0 || duration > 600) {
      return res.status(400).json({
        code: 400,
        message: '参数错误: duration 必须在 1 ~ 600 分钟之间',
      });
    }

    if (!bodyParts || typeof bodyParts !== 'string') {
      return res.status(400).json({
        code: 400,
        message: '参数错误: bodyParts 训练部位不能为空',
      });
    }

    const data = await workoutService.saveWorkoutRecord(userId, {
      date,
      duration,
      bodyParts,
      notes,
      exercises,
    });

    return res.json({
      code: 200,
      message: '打卡记录保存成功',
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 4. 删除指定训练记录
 * DELETE /api/workout/:id
 */
export async function deleteWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const recordId = req.params.id;

    if (!recordId) {
      return res.status(400).json({
        code: 400,
        message: '缺少 recordId 参数',
      });
    }

    await workoutService.deleteWorkoutRecord(userId, recordId);

    return res.json({
      code: 200,
      message: '删除成功',
      data: true,
    });
  } catch (error) {
    next(error);
  }
}
