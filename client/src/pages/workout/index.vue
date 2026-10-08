<template>
  <view class="workout-page">
    <!-- 顶部状态栏占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 可滚动主体内容 -->
    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <view class="inner-container">
        <!-- 1. 月度打卡日历卡片 (自动读取当前真实年月、当天圆圈高亮、部位徽章) -->
        <WorkoutCalendar
          :year="currentYear"
          :month="currentMonth"
          :selected-date-str="selectedDateStr"
          :workout-map="workoutMap"
          @select-date="handleSelectDate"
          @prev-month="handlePrevMonth"
          @next-month="handleNextMonth"
        />

        <!-- 2. 选中日期训练详情卡片 (3列：时长 / 部位 / 状态) -->
        <WorkoutDetailCard
          :detail="currentDetail"
          @click-record="openAddModal"
        />

        <!-- 留白避让底部固定按钮 -->
        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>

    <!-- 3. 底部悬浮添加训练大按钮 -->
    <view class="action-bar">
      <view class="add-button" @tap="openAddModal">
        <text class="plus-icon">+</text>
        <text class="add-text">添加今日训练</text>
      </view>
    </view>

    <!-- 4. 新增打卡半屏抽屉弹窗 -->
    <AddWorkoutModal
      v-model:visible="modalVisible"
      :default-date="selectedDateStr"
      @save="handleSaveWorkout"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WorkoutCalendar from './components/WorkoutCalendar.vue'
import WorkoutDetailCard from './components/WorkoutDetailCard.vue'
import AddWorkoutModal from './components/AddWorkoutModal.vue'
import type { DayWorkoutDetail, AddWorkoutForm } from './types'

// 自动读取用户设备/手机本地当前真实时间（纯前端，无须后端）
const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth() + 1)

// 格式化日期辅助函数 YYYY-MM-DD
const formatZero = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const formatDate = (y: number, m: number, d: number) => `${y}-${formatZero(m)}-${formatZero(d)}`

// 手机本地真实今日日期字符串 (如 "2026-10-08")
const todayDateStr = formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate())

// 页面默认直接选中今天！
const selectedDateStr = ref(todayDateStr)

// 弹窗可见性
const modalVisible = ref(false)

// 初始化打卡 Mock 数据（兼顾手机当前月份与历史原型数据）
function initMockWorkouts() {
  const map: Record<string, { bodyPartBadge: string; detail: DayWorkoutDetail }> = {}

  // 1. 今天打卡：肩部 & 手臂
  map[todayDateStr] = {
    bodyPartBadge: '肩',
    detail: { date: todayDateStr, durationMinutes: 60, bodyPartsTitle: '肩部 & 手臂', status: 'COMPLETED' },
  }

  // 2. 动态生成最近几天的打卡数据，保证任何月份打开日历都有漂亮的打卡标签
  const addRelativeDay = (offsetDays: number, badge: string, title: string, duration: number) => {
    const target = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000)
    const str = formatDate(target.getFullYear(), target.getMonth() + 1, target.getDate())
    map[str] = {
      bodyPartBadge: badge,
      detail: { date: str, durationMinutes: duration, bodyPartsTitle: title, status: 'COMPLETED' },
    }
  }

  addRelativeDay(-1, '胸', '胸部塑形与卧推', 45)
  addRelativeDay(-2, '背', '高位下拉与划船', 60)
  addRelativeDay(-4, '腿', '深蹲与股四头', 75)
  addRelativeDay(-5, '肩', '三角肌专项轰炸', 50)
  addRelativeDay(-7, '腰', '核心力量激活', 40)
  addRelativeDay(-8, '胸', '上胸与夹胸强化', 60)
  addRelativeDay(-10, '背', '背部厚度强化', 60)
  addRelativeDay(-12, '腿', '臀腿综合力量', 70)

  // 3. 保留原型图 2023年11月的历史数据，翻页到 2023-11 时依然能看到
  const protoRecords: Record<string, [string, string, number]> = {
    '2023-11-01': ['胸', '胸部塑形', 45],
    '2023-11-02': ['肩', '肩部 & 手臂', 60],
    '2023-11-04': ['肩', '肩部专项', 50],
    '2023-11-05': ['胸', '上胸塑形', 60],
    '2023-11-07': ['胸', '胸肌夹胸', 50],
    '2023-11-10': ['胸', '胸部力量', 60],
    '2023-11-12': ['肩', '三角肌前中束', 45],
    '2023-11-13': ['胸', '卧推强化', 60],
    '2023-11-14': ['肩', '肩袖稳定与推举', 50],
    '2023-11-15': ['背', '高位下拉与引体', 65],
    '2023-11-16': ['背', '划船与背阔肌', 60],
    '2023-11-18': ['腿', '深蹲与股四头', 75],
    '2023-11-19': ['腿', '臀腿塑形', 60],
    '2023-11-21': ['背', '背部厚度强化', 60],
    '2023-11-22': ['腰', '核心与腹部线条', 40],
    '2023-11-23': ['腰', '核心肌群激活', 45],
  }
  for (const [dStr, [b, t, dur]] of Object.entries(protoRecords)) {
    if (!map[dStr]) {
      map[dStr] = {
        bodyPartBadge: b,
        detail: { date: dStr, durationMinutes: dur, bodyPartsTitle: t, status: 'COMPLETED' },
      }
    }
  }

  return map
}

// 训练打卡响应式数据字典
const workoutMap = ref(initMockWorkouts())

// 计算当前选中日期的详情数据
const currentDetail = computed<DayWorkoutDetail | null>(() => {
  const item = workoutMap.value[selectedDateStr.value]
  return item ? item.detail : null
})

// 选中日期切换
const handleSelectDate = (dateStr: string) => {
  selectedDateStr.value = dateStr
}

// 切换月份
const handlePrevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--
    currentMonth.value = 12
  } else {
    currentMonth.value--
  }
}

const handleNextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++
    currentMonth.value = 1
  } else {
    currentMonth.value++
  }
}

// 唤起添加弹窗
const openAddModal = () => {
  modalVisible.value = true
}

// 保存打卡
const handleSaveWorkout = (form: AddWorkoutForm) => {
  const badgeChar = extractBadge(form.bodyParts.join(''))
  const title = form.bodyParts.join(' & ')

  workoutMap.value[form.date] = {
    bodyPartBadge: badgeChar,
    detail: {
      date: form.date,
      durationMinutes: form.duration,
      bodyPartsTitle: title,
      status: 'COMPLETED',
      notes: form.notes,
    },
  }

  uni.showToast({
    title: '打卡成功！',
    icon: 'success',
  })
}

// 简字提取辅助
function extractBadge(partsText: string): string {
  if (partsText.includes('胸')) return '胸'
  if (partsText.includes('肩')) return '肩'
  if (partsText.includes('背')) return '背'
  if (partsText.includes('腿')) return '腿'
  if (partsText.includes('腰') || partsText.includes('核心')) return '腰'
  if (partsText.includes('臂')) return '臂'
  if (partsText.includes('有氧')) return '跑'
  return partsText.charAt(0) || '练'
}
</script>

<style scoped>
.workout-page {
  min-height: 100vh;
  background-color: #F7F8FA;
  display: flex;
  flex-direction: column;
}

.status-bar-placeholder {
  height: env(safe-area-inset-top);
  min-height: 48rpx;
  background-color: #F7F8FA;
}

.scroll-content {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
}

.inner-container {
  padding: 16rpx 28rpx 180rpx 28rpx;
}

.bottom-spacer {
  height: 60rpx;
}

/* 底部常驻悬浮打卡大按钮 */
.action-bar {
  position: fixed;
  bottom: calc(24rpx + env(safe-area-inset-bottom));
  left: 32rpx;
  right: 32rpx;
  z-index: 100;
}

.add-button {
  background: linear-gradient(135deg, #74C043 0%, #67C23A 100%);
  height: 98rpx;
  border-radius: 49rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 28rpx rgba(103, 194, 58, 0.45);
  transition: transform 0.15s ease;
}

.add-button:active {
  transform: scale(0.985);
}

.plus-icon {
  font-size: 38rpx;
  font-weight: 700;
  color: #FFFFFF;
  margin-right: 12rpx;
  line-height: 1;
}

.add-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 1rpx;
}
</style>
