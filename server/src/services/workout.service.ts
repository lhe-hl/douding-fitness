import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { extractBadge, resolveNotesUpdate } from '../domain/workout-rules';

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
  notes?: string | null;
  exercises?: ExerciseItemInput[];
}

export class WorkoutAccessError extends Error {
  status = 404;

  constructor() {
    super('训练记录不存在或无权操作');
  }
}

function toExerciseData(item: ExerciseItemInput) {
  return {
    actionName: item.actionName,
    sets: item.sets,
    weight: item.weight,
    reps: item.reps,
  };
}

function isUniqueConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

async function replaceExercisesIfProvided(recordId: string, exercises: ExerciseItemInput[] | undefined) {
  if (!exercises || exercises.length === 0) return;
  await prisma.exerciseItem.deleteMany({
    where: { workoutRecordId: recordId },
  });
  await prisma.exerciseItem.createMany({
    data: exercises.map((item) => ({
      workoutRecordId: recordId,
      ...toExerciseData(item),
    })),
  });
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
    orderBy: [{ date: 'asc' }, { updatedAt: 'desc' }],
  });

  const seen = new Set<string>();
  const items: Array<{
    id: string;
    date: string;
    duration: number;
    bodyParts: string;
    bodyPartBadge: string;
  }> = [];

  for (const record of records) {
    if (seen.has(record.date)) continue;
    seen.add(record.date);
    items.push({
      id: record.id,
      date: record.date,
      duration: record.duration,
      bodyParts: record.bodyParts,
      bodyPartBadge: extractBadge(record.bodyParts),
    });
  }

  return items;
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
    orderBy: {
      updatedAt: 'desc',
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
    status: 'COMPLETED' as const,
    notes: record.notes ? record.notes : null,
    exercises: record.exercises.map((item) => ({
      id: item.id,
      actionName: item.actionName,
      sets: item.sets,
      weight: item.weight,
      reps: item.reps,
    })),
  };
}

async function updateExisting(recordId: string, existingNotes: string | null, input: SaveWorkoutInput) {
  await prisma.workoutRecord.update({
    where: { id: recordId },
    data: {
      duration: input.duration,
      bodyParts: input.bodyParts,
      notes: resolveNotesUpdate(input.notes, existingNotes),
    },
  });
  await replaceExercisesIfProvided(recordId, input.exercises);
}

/**
 * 3. 保存/更新训练打卡记录。同一用户同一天只有一条主记录。
 * 请求不带 exercises 时，不删除、不改写已有动作明细。
 */
export async function saveWorkoutRecord(userId: string, input: SaveWorkoutInput) {
  const existing = await prisma.workoutRecord.findFirst({
    where: {
      userId,
      date: input.date,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (existing) {
    await updateExisting(existing.id, existing.notes, input);
    return getDayDetail(userId, input.date);
  }

  try {
    await prisma.workoutRecord.create({
      data: {
        userId,
        date: input.date,
        duration: input.duration,
        bodyParts: input.bodyParts,
        notes: resolveNotesUpdate(input.notes, null),
        exercises:
          input.exercises && input.exercises.length > 0
            ? {
                create: input.exercises.map((item) => toExerciseData(item)),
              }
            : undefined,
      },
    });
  } catch (error) {
    if (!isUniqueConflict(error)) throw error;
    const winner = await prisma.workoutRecord.findFirst({
      where: { userId, date: input.date },
      orderBy: { updatedAt: 'desc' },
    });
    if (!winner) throw error;
    await updateExisting(winner.id, winner.notes, input);
  }

  return getDayDetail(userId, input.date);
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
    throw new WorkoutAccessError();
  }

  await prisma.workoutRecord.delete({
    where: { id: recordId },
  });

  return true;
}
