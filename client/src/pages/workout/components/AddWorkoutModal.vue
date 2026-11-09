<template>
  <view v-if="visible" class="modal-root">
    <view class="modal-mask" @tap="handleClose"></view>

    <view class="modal-sheet">
      <view v-if="saving" class="saving-shield"></view>
      <view class="sheet-header">
        <view class="header-drag-handle"></view>
        <view class="header-content">
          <text class="sheet-title">{{ titleText }}</text>
          <view class="close-btn" @tap="handleClose">
            <text class="close-icon">✕</text>
          </view>
        </view>
      </view>

      <scroll-view scroll-y class="sheet-body">
        <view class="form-section">
          <text class="section-label">打卡日期</text>
          <view class="date-badge">
            <text class="date-text">{{ dateText }}</text>
          </view>
        </view>

        <view class="form-section">
          <text class="section-label">训练部位（可多选）</text>
          <text v-if="seed.unresolvedTitle" class="unresolved-title">当前记录：{{ seed.unresolvedTitle }}</text>
          <text v-if="seed.unresolvedTitle" class="unresolved-hint">无法对应到下面的部位，请重新选择后再保存</text>
          <view class="chips-group">
            <view
              v-for="part in partOptions"
              :key="part"
              class="chip-item"
              :class="{ 'chip-active': selectedParts.includes(part) }"
              @tap="togglePart(part)"
            >
              <text class="chip-text">{{ part }}</text>
            </view>
          </view>
        </view>

        <view class="form-section">
          <view class="section-label-row">
            <text class="section-label">训练时长</text>
            <text class="duration-highlight">{{ duration }} 分钟</text>
          </view>
          <view class="duration-chips">
            <view
              v-for="option in durationOptions"
              :key="option"
              class="duration-chip"
              :class="{ 'duration-chip-active': duration === option }"
              @tap="setDuration(option)"
            >
              <text class="duration-chip-text">{{ option }}</text>
            </view>
          </view>
        </view>

        <view class="form-section">
          <text class="section-label">今日感受（选填）</text>
          <input
            v-model="notes"
            class="note-input"
            :disabled="saving"
            placeholder="例如：今天肩有点酸，但完成了"
            placeholder-class="input-placeholder"
          />
        </view>
      </scroll-view>

      <view class="sheet-footer">
        <view
          class="submit-btn"
          :class="{ 'submit-btn-disabled': !canSubmit && !saving }"
          @tap="handleSubmit"
        >
          <text class="submit-text">{{ saving ? '保存中' : '确认保存打卡' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { BODY_PART_OPTIONS, formatFormTitle, formatSelectedDateLabel } from '../../../domain/today-workout'
import type { AddWorkoutForm, WorkoutFormSeed } from '../types'

const props = defineProps<{
  visible: boolean
  seed: WorkoutFormSeed
  saving: boolean
  todayDateStr: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'save', form: AddWorkoutForm): void
}>()

const partOptions = BODY_PART_OPTIONS
const durationOptions = [30, 45, 60, 90, 120]
const selectedParts = ref<string[]>([...props.seed.bodyParts])
const duration = ref(props.seed.duration)
const notes = ref(props.seed.notes)

const canSubmit = computed(() => selectedParts.value.length > 0)
const titleText = computed(() => formatFormTitle(props.seed.date, props.seed.editing))
const dateText = computed(() => formatSelectedDateLabel(props.seed.date, props.todayDateStr))

const togglePart = (part: string) => {
  if (props.saving) return
  const index = selectedParts.value.indexOf(part)
  if (index >= 0) selectedParts.value.splice(index, 1)
  else selectedParts.value.push(part)
}

const setDuration = (option: number) => {
  if (props.saving) return
  duration.value = option
}

const handleClose = () => {
  if (props.saving) return
  emit('update:visible', false)
}

const handleSubmit = () => {
  if (props.saving) return
  if (!canSubmit.value) {
    uni.showToast({ title: '请至少选择一个训练部位', icon: 'none' })
    return
  }
  emit('save', {
    date: props.seed.date,
    bodyParts: [...selectedParts.value],
    duration: duration.value,
    notes: notes.value,
  })
}
</script>

<style scoped>
.modal-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
}

.modal-sheet {
  position: relative;
  background: #FFFFFF;
  border-radius: 44rpx 44rpx 0 0;
  padding: 24rpx 36rpx calc(36rpx + env(safe-area-inset-bottom)) 36rpx;
  max-height: 82vh;
  box-shadow: 0 -12rpx 40rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.saving-shield {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.sheet-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20rpx;
}

.header-drag-handle {
  width: 72rpx;
  height: 8rpx;
  background: #E0E4E8;
  border-radius: 4rpx;
  margin-bottom: 24rpx;
}

.header-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.sheet-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #111111;
}

.close-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #F4F6F9;
}

.close-icon {
  font-size: 24rpx;
  color: #8E8E93;
}

.sheet-body {
  max-height: 54vh;
}

.form-section {
  margin-top: 28rpx;
}

.section-label {
  font-size: 26rpx;
  font-weight: 700;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
}

.unresolved-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #333333;
  margin-bottom: 8rpx;
}

.unresolved-hint {
  display: block;
  font-size: 22rpx;
  color: #A0A5AB;
  margin-bottom: 16rpx;
}

.section-label-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.duration-highlight {
  font-size: 28rpx;
  font-weight: 800;
  color: #67C23A;
}

.date-badge {
  display: inline-block;
  background: #F4F6F9;
  padding: 12rpx 28rpx;
  border-radius: 20rpx;
}

.date-text {
  font-size: 26rpx;
  color: #111111;
  font-weight: 600;
}

.chips-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16rpx;
}

.chip-item {
  padding: 14rpx 28rpx;
  background: #F4F6F9;
  border-radius: 32rpx;
}

.chip-active {
  background: #67C23A;
  box-shadow: 0 4rpx 14rpx rgba(103, 194, 58, 0.4);
}

.chip-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #4A515A;
}

.chip-active .chip-text {
  color: #FFFFFF;
  font-weight: 700;
}

.duration-chips {
  display: flex;
  flex-direction: row;
  gap: 14rpx;
}

.duration-chip {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  background: #F4F6F9;
  border-radius: 24rpx;
  border: 2rpx solid transparent;
}

.duration-chip-active {
  background: #E8F6DC;
  border-color: #67C23A;
}

.duration-chip-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #555555;
}

.duration-chip-active .duration-chip-text {
  color: #2F6F0E;
  font-weight: 800;
}

.note-input {
  background: #F4F6F9;
  border-radius: 24rpx;
  padding: 20rpx 24rpx;
  font-size: 26rpx;
  color: #111111;
}

.input-placeholder {
  color: #A0A5AB;
}

.sheet-footer {
  margin-top: 36rpx;
}

.submit-btn {
  background: linear-gradient(135deg, #74C043 0%, #67C23A 100%);
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(103, 194, 58, 0.4);
}

.submit-btn-disabled {
  background: #E0E4E8;
  box-shadow: none;
}

.submit-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 800;
}

.submit-btn-disabled .submit-text {
  color: #8E8E93;
}
</style>
