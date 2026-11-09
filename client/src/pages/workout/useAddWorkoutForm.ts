import { computed, ref } from 'vue'
import {
  BODY_PART_OPTIONS,
  DURATION_PRESETS,
  formatFormTitle,
  formatSelectedDateLabel,
  parseDurationMinutes,
} from '../../domain/today-workout'
import type { AddWorkoutForm, WorkoutFormSeed } from './types'

export function useAddWorkoutForm(
  props: { seed: WorkoutFormSeed; saving: boolean; todayDateStr: string },
  emit: (event: 'save', form: AddWorkoutForm) => void,
) {
  const partOptions = BODY_PART_OPTIONS
  const durationOptions = DURATION_PRESETS
  const selectedParts = ref<string[]>([...props.seed.bodyParts])
  const duration = ref(props.seed.duration)
  const customDuration = ref(!durationOptions.includes(props.seed.duration as (typeof DURATION_PRESETS)[number]))
  const customDurationText = ref(customDuration.value ? String(props.seed.duration) : '')
  const notes = ref(props.seed.notes)
  const customPartOpen = ref(selectedParts.value.some((part) => !partOptions.includes(part as (typeof BODY_PART_OPTIONS)[number])))
  const customPartText = ref('')

  const customParts = computed(() => selectedParts.value.filter((part) => !partOptions.includes(part as (typeof BODY_PART_OPTIONS)[number])))
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
    customDuration.value = false
    duration.value = option
  }

  const enableCustomDuration = () => {
    if (props.saving) return
    customDuration.value = true
    if (!customDurationText.value) customDurationText.value = String(duration.value)
  }

  const onCustomDurationInput = (event: unknown) => {
    const detail = (event as { detail?: { value?: string } | string }).detail
    const value = typeof detail === 'object' && detail ? (detail.value ?? '') : ''
    customDurationText.value = value
    const parsed = parseDurationMinutes(value)
    if (parsed != null) duration.value = parsed
  }

  const addCustomPart = () => {
    if (props.saving) return
    const name = customPartText.value.trim()
    if (!name) {
      uni.showToast({ title: '请输入部位名称', icon: 'none' })
      return
    }
    if (name.includes('&') || name === '自定义') {
      uni.showToast({ title: '部位名称不要包含 &', icon: 'none' })
      return
    }
    if (!selectedParts.value.includes(name)) selectedParts.value.push(name)
    customPartText.value = ''
  }

  const handleSubmit = () => {
    if (props.saving) return
    if (!canSubmit.value) {
      uni.showToast({ title: '请至少选择一个训练部位', icon: 'none' })
      return
    }
    let minutes = duration.value
    if (customDuration.value) {
      const parsed = parseDurationMinutes(customDurationText.value)
      if (parsed == null) {
        uni.showToast({ title: '请输入 1 到 600 的分钟数', icon: 'none' })
        return
      }
      minutes = parsed
    }
    emit('save', {
      date: props.seed.date,
      bodyParts: [...selectedParts.value],
      duration: minutes,
      notes: notes.value,
    })
  }

  return {
    partOptions,
    durationOptions,
    selectedParts,
    customParts,
    duration,
    customDuration,
    customDurationText,
    notes,
    customPartOpen,
    customPartText,
    canSubmit,
    titleText,
    dateText,
    togglePart,
    setDuration,
    enableCustomDuration,
    onCustomDurationInput,
    addCustomPart,
    handleSubmit,
  }
}
