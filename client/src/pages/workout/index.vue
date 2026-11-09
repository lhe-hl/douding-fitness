<template>
  <view class="workout-page">
    <view class="status-bar-placeholder"></view>

    <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
      <view class="inner-container">
        <WorkoutCalendar
          :year="currentYear"
          :month="currentMonth"
          :selected-date-str="selectedDateStr"
          :workout-map="workoutMap"
          :month-notice="monthNotice"
          @select-date="handleSelectDate"
          @prev-month="handlePrevMonth"
          @next-month="handleNextMonth"
          @retry="retryMonth"
        />

        <WorkoutDetailCard
          :phase="detailPhase"
          :detail="currentDetail"
          :deleting="deleting"
          @record="openAddModal"
          @retry="retryDay"
          @delete="confirmDelete"
        />

        <view class="bottom-spacer"></view>
      </view>
    </scroll-view>

    <view class="action-bar">
      <view
        class="add-button"
        :class="{ 'add-button-disabled': actionDisabled }"
        @tap="onActionTap"
      >
        <text v-if="!actionDisabled" class="plus-icon">+</text>
        <text class="add-text">{{ actionText }}</text>
      </view>
    </view>

    <AddWorkoutModal
      v-if="modalVisible && formSeed"
      :visible="modalVisible"
      :seed="formSeed"
      :saving="saving"
      :today-date-str="todayDateStr"
      @update:visible="modalVisible = $event"
      @save="handleSaveWorkout"
    />
  </view>
</template>

<script setup lang="ts">
import WorkoutCalendar from './components/WorkoutCalendar.vue'
import WorkoutDetailCard from './components/WorkoutDetailCard.vue'
import AddWorkoutModal from './components/AddWorkoutModal.vue'
import { useWorkoutPage } from './useWorkoutPage'

const {
  currentYear,
  currentMonth,
  todayDateStr,
  selectedDateStr,
  modalVisible,
  saving,
  deleting,
  formSeed,
  workoutMap,
  monthNotice,
  detailPhase,
  currentDetail,
  actionDisabled,
  actionText,
  handleSelectDate,
  handlePrevMonth,
  handleNextMonth,
  retryMonth,
  retryDay,
  openAddModal,
  onActionTap,
  handleSaveWorkout,
  confirmDelete,
} = useWorkoutPage()
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
}

.add-button-disabled {
  opacity: 0.45;
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
