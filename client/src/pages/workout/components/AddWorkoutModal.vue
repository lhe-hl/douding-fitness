<template>
  <view v-if="visible" class="modal-root">
    <!-- 遮罩背景 -->
    <view class="modal-mask" @tap="handleClose"></view>

    <!-- 半屏抽屉容器 -->
    <view class="modal-sheet">
      <!-- 顶部拖拽横条与标题 -->
      <view class="sheet-header">
        <view class="header-drag-handle"></view>
        <view class="header-content">
          <text class="sheet-title">记录今日训练</text>
          <view class="close-btn" @tap="handleClose">
            <text class="close-icon">✕</text>
          </view>
        </view>
      </view>

      <!-- 表单区域 -->
      <scroll-view scroll-y class="sheet-body">
        <!-- 1. 打卡日期 -->
        <view class="form-section">
          <text class="section-label">打卡日期</text>
          <view class="date-badge">
            <text class="date-text">📅 {{ displayDate }}</text>
          </view>
        </view>

        <!-- 2. 训练部位多选 -->
        <view class="form-section">
          <text class="section-label">训练部位 (可多选)</text>
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

        <!-- 3. 训练时长 -->
        <view class="form-section">
          <view class="section-label-row">
            <text class="section-label">训练时长</text>
            <text class="duration-highlight">{{ duration }} 分钟</text>
          </view>
          <!-- 快捷时长胶囊 -->
          <view class="duration-chips">
            <view
              v-for="d in [30, 45, 60, 90, 120]"
              :key="d"
              class="duration-chip"
              :class="{ 'duration-chip-active': duration === d }"
              @tap="duration = d"
            >
              <text class="duration-chip-text">{{ d }}m</text>
            </view>
          </view>
        </view>

        <!-- 4. 训练备注 (选填) -->
        <view class="form-section">
          <text class="section-label">心得备注 (选填)</text>
          <input
            v-model="notes"
            class="note-input"
            placeholder="例如：哑铃卧推突破 24kg，肩峰泵感好"
            placeholder-class="input-placeholder"
          />
        </view>
      </scroll-view>

      <!-- 底部提交按钮 -->
      <view class="sheet-footer">
        <view class="submit-btn" @tap="handleSubmit">
          <text class="submit-text">确认保存打卡</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { AddWorkoutForm } from '../types'

interface Props {
  visible: boolean
  defaultDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  defaultDate: '',
})

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'save', form: AddWorkoutForm): void
}>()

const partOptions = ['胸部', '背部', '肩部', '腿部', '手臂', '腰腹核心', '有氧燃脂']

const selectedParts = ref<string[]>(['肩部', '手臂'])
const duration = ref<number>(60)
const notes = ref<string>('')

const displayDate = computed(() => {
  return props.defaultDate || '今日'
})

watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (selectedParts.value.length === 0) {
        selectedParts.value = ['肩部']
      }
    }
  }
)

const togglePart = (part: string) => {
  const idx = selectedParts.value.indexOf(part)
  if (idx >= 0) {
    if (selectedParts.value.length > 1) {
      selectedParts.value.splice(idx, 1)
    }
  } else {
    selectedParts.value.push(part)
  }
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  if (selectedParts.value.length === 0) {
    uni.showToast({
      title: '请至少选择一个训练部位',
      icon: 'none',
    })
    return
  }

  emit('save', {
    date: props.defaultDate,
    bodyParts: [...selectedParts.value],
    duration: duration.value,
    notes: notes.value,
  })

  handleClose()
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
  backdrop-filter: blur(4px);
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

/* 训练部位标签 */
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
  transition: all 0.2s ease;
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

/* 时长胶囊 */
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
}

.duration-chip-active {
  background: #E8F6DC;
  border: 2rpx solid #67C23A;
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

/* 底部提交按钮 */
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

.submit-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 800;
}
</style>
