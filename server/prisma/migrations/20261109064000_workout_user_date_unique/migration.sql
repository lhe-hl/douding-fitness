-- 同一用户、同一天只留 updatedAt 最新的一行（相同时间再比 id），并保留它的动作明细。
CREATE TABLE "_workout_keep" AS
SELECT "id"
FROM (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "userId", "date"
      ORDER BY "updatedAt" DESC, "id" DESC
    ) AS "rn"
  FROM "WorkoutRecord"
) AS "ranked"
WHERE "ranked"."rn" = 1;

DELETE FROM "ExerciseItem"
WHERE "workoutRecordId" IN (
  SELECT "id" FROM "WorkoutRecord"
  WHERE "id" NOT IN (SELECT "id" FROM "_workout_keep")
);

DELETE FROM "WorkoutRecord"
WHERE "id" NOT IN (SELECT "id" FROM "_workout_keep");

DROP TABLE "_workout_keep";

DROP INDEX IF EXISTS "WorkoutRecord_userId_date_idx";

CREATE UNIQUE INDEX "WorkoutRecord_userId_date_key" ON "WorkoutRecord"("userId", "date");
