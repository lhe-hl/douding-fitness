import { prisma } from '../prisma';

export interface ExerciseItemInput {
  actionName: string;
  sets: number;
  weight: number;
  reps: number;
}

export interface SaveWorkoutInput {
  date: string;
  duration: number;
  bodyParts: string;
  notes?: string;
  exercises?: ExerciseItemInput[];
}

/**
 * 训练部位简字提取算法 (如: "肩部 & 手臂" -> "肩")
 */
export function extractBadge(bodyParts: string): string {
  if (!bodyParts) return '练';
  if (bodyParts.includes('胸')) return '胸';
  if (bodyParts.includes('肩')) return '肩';
  if (bodyParts.includes('背')) return '背';
  if (bodyParts.includes('腿')) return '腿';
  if (bodyParts.includes('腰') || bodyParts.includes('核心')) return '腰';
  if (bodyParts.includes('臂') || bodyParts.includes('二头') || bodyParts.includes('三头')) return '臂';
  if (bodyParts.includes('有氧') || bodyParts.includes('跑')) return '跑';
  return bodyParts.charAt(0) || '练';
}

/**
 * 1. 查询用户指定月份的打卡概要列表 (用于日历网格渲染徽章)
 */
export async function getMonthOverview(userId: string, year: number, month: number) {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const prefix = `${year}-${monthStr}-`;

  const records = await prisma.workoutRecord.findMany({
    where: {
      userId,
      date: {
        startsWith: prefix,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  return records.map((r) => ({
    id: r.id,
    date: r.date,
    duration: r.duration,
    bodyParts: r.bodyParts,
    bodyPartBadge: extractBadge(r.bodyParts),
  }));
}

/**
 * 2. 查询用户指定日期的详细训练记录 (用于详情卡片展示)
 */
export async function getDayDetail(userId: string, date: string) {
  const record = await prisma.workoutRecord.findFirst({
    where: {
      userId,
      date,
    },
    include: {
      exercises: {
        orderBy: {
          sets: 'asc',
        },
      },
    },
  });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    date: record.date,
    durationMinutes: record.duration,
    bodyPartsTitle: record.bodyParts,
    status: 'COMPLETED',
    notes: record.notes,
    exercises: record.exercises,
  };
}

/**
 * 3. 保存/更新训练打卡记录 (幂等 Upsert 逻辑)
 */
export async function saveWorkoutRecord(userId: string, input: SaveWorkoutInput) {
  const { date, duration, bodyParts, notes, exercises } = input;

  // 检查当天是否已有记录
  const existing = await prisma.workoutRecord.findFirst({
    where: {
      userId,
      date,
    },
  });

  let savedRecordId: string;

  if (existing) {
    // 更新已有记录
    const updated = await prisma.workoutRecord.update({
      where: { id: existing.id },
      data: {
        duration,
        bodyParts,
        notes: notes ?? existing.notes,
      },
    });
    savedRecordId = updated.id;

    // 如果提交了新的动作列表，先清理旧动作再批量写入
    if (exercises && exercises.length > 0) {
      await prisma.exerciseItem.deleteMany({
        where: { workoutRecordId: savedRecordId },
      });
      await prisma.exerciseItem.createMany({
        data: exercises.map((item) => ({
          workoutRecordId: savedRecordId,
          actionName: item.actionName,
          sets: item.sets,
          weight: item.weight,
          reps: item.reps,
        })),
      });
    }
  } else {
    // 新建打卡记录
    const created = await prisma.workoutRecord.create({
      data: {
        userId,
        date,
        duration,
        bodyParts,
        notes,
        exercises:
          exercises && exercises.length > 0
            ? {
                create: exercises.map((item) => ({
                  actionName: item.actionName,
                  sets: item.sets,
                  weight: item.weight,
                  reps: item.reps,
                })),
              }
            : undefined,
      },
    });
    savedRecordId = created.id;
  }

  // 返回最新详情
  return getDayDetail(userId, date);
}

/**
 * 4. 删除指定训练记录
 */
export async function deleteWorkoutRecord(userId: string, recordId: string) {
  const record = await prisma.workoutRecord.findFirst({
    where: {
      id: recordId,
      userId,
    },
  });

  if (!record) {
    throw new Error('训练记录不存在或无权操作');
  }

  await prisma.workoutRecord.delete({
    where: { id: recordId },
  });

  return true;
}
