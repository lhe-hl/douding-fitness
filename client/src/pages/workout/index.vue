<template>
  <view class="workout-page">
    <!-- 顶部状态栏占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 可滚动主体内容 -->
    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <view class="inner-container">
        <!-- 1. 月度打卡日历卡片 (含年月切换、7x6网格、部位小胶囊徽章) -->
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

// 年月状态（默认对应原型图的 2023年11月）
const currentYear = ref(2023)
const currentMonth = ref(11)

// 当前选中的日期（默认对应原型图高亮的 2023-11-02）
const selectedDateStr = ref('2023-11-02')

// 弹窗可见性
const modalVisible = ref(false)

// 训练打卡本地响应式数据字典（完全契合原型图）
const workoutMap = ref<Record<string, { bodyPartBadge: string; detail: DayWorkoutDetail }>>({
  '2023-11-01': {
    bodyPartBadge: '胸',
    detail: { date: '2023-11-01', durationMinutes: 45, bodyPartsTitle: '胸部塑形', status: 'COMPLETED' },
  },
  '2023-11-02': {
    bodyPartBadge: '肩',
    detail: { date: '2023-11-02', durationMinutes: 60, bodyPartsTitle: '肩部 & 手臂', status: 'COMPLETED' },
  },
  '2023-11-04': {
    bodyPartBadge: '肩',
    detail: { date: '2023-11-04', durationMinutes: 50, bodyPartsTitle: '肩部专项', status: 'COMPLETED' },
  },
  '2023-11-05': {
    bodyPartBadge: '胸',
    detail: { date: '2023-11-05', durationMinutes: 60, bodyPartsTitle: '上胸塑形', status: 'COMPLETED' },
  },
  '2023-11-07': {
    bodyPartBadge: '胸',
    detail: { date: '2023-11-07', durationMinutes: 50, bodyPartsTitle: '胸肌夹胸', status: 'COMPLETED' },
  },
  '2023-11-10': {
    bodyPartBadge: '胸',
    detail: { date: '2023-11-10', durationMinutes: 60, bodyPartsTitle: '胸部力量', status: 'COMPLETED' },
  },
  '2023-11-12': {
    bodyPartBadge: '肩',
    detail: { date: '2023-11-12', durationMinutes: 45, bodyPartsTitle: '三角肌前中束', status: 'COMPLETED' },
  },
  '2023-11-13': {
    bodyPartBadge: '胸',
    detail: { date: '2023-11-13', durationMinutes: 60, bodyPartsTitle: '卧推强化', status: 'COMPLETED' },
  },
  '2023-11-14': {
    bodyPartBadge: '肩',
    detail: { date: '2023-11-14', durationMinutes: 50, bodyPartsTitle: '肩袖稳定与推举', status: 'COMPLETED' },
  },
  '2023-11-15': {
    bodyPartBadge: '背',
    detail: { date: '2023-11-15', durationMinutes: 65, bodyPartsTitle: '高位下拉与引体', status: 'COMPLETED' },
  },
  '2023-11-16': {
    bodyPartBadge: '背',
    detail: { date: '2023-11-16', durationMinutes: 60, bodyPartsTitle: '划船与背阔肌', status: 'COMPLETED' },
  },
  '2023-11-18': {
    bodyPartBadge: '腿',
    detail: { date: '2023-11-18', durationMinutes: 75, bodyPartsTitle: '深蹲与股四头', status: 'COMPLETED' },
  },
  '2023-11-19': {
    bodyPartBadge: '腿',
    detail: { date: '2023-11-19', durationMinutes: 60, bodyPartsTitle: '臀腿塑形', status: 'COMPLETED' },
  },
  '2023-11-21': {
    bodyPartBadge: '背',
    detail: { date: '2023-11-21', durationMinutes: 60, bodyPartsTitle: '背部厚度强化', status: 'COMPLETED' },
  },
  '2023-11-22': {
    bodyPartBadge: '腰',
    detail: { date: '2023-11-22', durationMinutes: 40, bodyPartsTitle: '核心与腹部线条', status: 'COMPLETED' },
  },
  '2023-11-23': {
    bodyPartBadge: '腰',
    detail: { date: '2023-11-23', durationMinutes: 45, bodyPartsTitle: '核心肌群激活', status: 'COMPLETED' },
  },
})

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
