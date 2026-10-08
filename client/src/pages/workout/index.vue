<template>
  <view class="workout-page">
    <!-- 顶部状态栏占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 可滚动主体内容 -->
    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <view class="inner-container">
        <!-- 1. 月度打卡日历卡片 (真实接口数据渲染) -->
        <WorkoutCalendar
          :year="currentYear"
          :month="currentMonth"
          :selected-date-str="selectedDateStr"
          :workout-map="workoutMap"
          @select-date="handleSelectDate"
          @prev-month="handlePrevMonth"
          @next-month="handleNextMonth"
        />

        <!-- 2. 选中日期训练详情卡片 (真实接口数据渲染) -->
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

    <!-- 4. 新增打卡半屏抽屉弹窗 (真实接口提交) -->
    <AddWorkoutModal
      v-model:visible="modalVisible"
      :default-date="selectedDateStr"
      @save="handleSaveWorkout"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import WorkoutCalendar from './components/WorkoutCalendar.vue'
import WorkoutDetailCard from './components/WorkoutDetailCard.vue'
import AddWorkoutModal from './components/AddWorkoutModal.vue'
import type { DayWorkoutDetail, AddWorkoutForm } from './types'
import { getWorkoutMonth, getWorkoutDay, saveWorkout } from '../../api/workout'
import { loginDev } from '../../api/user'
import { getToken } from '../../api/request'
import { useWorkoutStore } from '../../stores/workout'

// 自动读取用户设备/手机本地当前真实时间
const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth() + 1)

// 格式化日期辅助函数 YYYY-MM-DD
const formatZero = (n: number) => (n < 10 ? `0${n}` : `${n}`)
const formatDate = (y: number, m: number, d: number) => `${y}-${formatZero(m)}-${formatZero(d)}`

// 手机本地真实今日日期字符串 (如 "2026-10-08")
const todayDateStr = formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate())

// 页面默认选中今天
const selectedDateStr = ref(todayDateStr)

// 弹窗可见性
const modalVisible = ref(false)

// 真实打卡日历数据字典（纯后端驱动，零死数据）
const workoutMap = ref<Record<string, { bodyPartBadge: string }>>({})

// 当前选中日期的详细训练记录 (来自后端 GET /api/workout/day)
const currentDetail = ref<DayWorkoutDetail | null>(null)

// 异步拉取当前月份的真实打卡日历数据
const loadMonthData = async () => {
  try {
    const list = await getWorkoutMonth(currentYear.value, currentMonth.value)
    const map: Record<string, { bodyPartBadge: string }> = {}
    if (Array.isArray(list)) {
      list.forEach((item) => {
        map[item.date] = {
          bodyPartBadge: item.bodyPartBadge,
        }
      })
    }
    workoutMap.value = map
  } catch (err) {
    console.error('获取月度打卡失败:', err)
  }
}

// 异步拉取指定日期的训练明细
const loadDayDetail = async (dateStr: string) => {
  try {
    const res = await getWorkoutDay(dateStr)
    if (res) {
      currentDetail.value = {
        recordId: res.id,
        date: res.date,
        durationMinutes: res.durationMinutes,
        bodyPartsTitle: res.bodyPartsTitle,
        status: res.status,
        notes: res.notes,
      }
    } else {
      currentDetail.value = null
    }
  } catch (err) {
    console.error('获取单日明细失败:', err)
    currentDetail.value = null
  }
}

// 页面初始化：确保有 Token，然后拉取真实数据库数据
const initPageData = async () => {
  try {
    // 开发模式：如果本地尚未存储 Token，自动静默登录测试账号
    if (!getToken()) {
      await loginDev('test-user-001')
    }
    await Promise.all([
      loadMonthData(),
      loadDayDetail(selectedDateStr.value),
    ])
  } catch (err) {
    console.error('初始化页面数据失败:', err)
  }
}

onMounted(() => {
  initPageData()
})

onShow(() => {
  // 切回页面时静默刷新最新数据
  if (getToken()) {
    loadMonthData()
    loadDayDetail(selectedDateStr.value)
  }
})

// 选中日期切换
const handleSelectDate = async (dateStr: string) => {
  selectedDateStr.value = dateStr
  await loadDayDetail(dateStr)
}

// 切换月份
const handlePrevMonth = async () => {
  if (currentMonth.value === 1) {
    currentYear.value--
    currentMonth.value = 12
  } else {
    currentMonth.value--
  }
  await loadMonthData()
}

const handleNextMonth = async () => {
  if (currentMonth.value === 12) {
    currentYear.value++
    currentMonth.value = 1
  } else {
    currentMonth.value++
  }
  await loadMonthData()
}

// 唤起添加弹窗
const openAddModal = () => {
  modalVisible.value = true
}

// 真实保存打卡到后端数据库
const handleSaveWorkout = async (form: AddWorkoutForm) => {
  try {
    const title = form.bodyParts.join(' & ')
    await saveWorkout({
      date: form.date,
      duration: form.duration,
      bodyParts: title,
      notes: form.notes,
    })

    uni.showToast({
      title: '打卡成功！',
      icon: 'success',
    })

    // 重新拉取真实日历数据与当天明细
    await Promise.all([
      loadMonthData(),
      loadDayDetail(form.date),
    ])

    // 同步到 Pinia workoutStore
    const workoutStore = useWorkoutStore()
    const badgeChar = extractBadge(title)
    const dayOfWeek = (new Date(form.date).getDay() + 6) % 7 // 周一对应索引 0
    workoutStore.recordWorkout(dayOfWeek, badgeChar)
  } catch (err) {
    console.error('保存打卡失败:', err)
  }
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
