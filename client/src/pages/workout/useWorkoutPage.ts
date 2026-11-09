import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getToken } from '../../api/request'
import { loginDev } from '../../api/user'
import {
  deleteWorkout,
  getWorkoutDay,
  getWorkoutMonth,
  saveWorkout,
  type DayWorkoutDetailResponse,
} from '../../api/workout'
import { formatLocalYmd, resolveFormInitial } from '../../domain/today-workout'
import type {
  AddWorkoutForm,
  DayWorkoutDetail,
  MonthNotice,
  WorkoutDetailPhase,
  WorkoutFormSeed,
} from './types'

function readErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

function mapDetail(res: DayWorkoutDetailResponse): DayWorkoutDetail {
  return {
    recordId: res.id,
    date: res.date,
    durationMinutes: res.durationMinutes,
    bodyPartsTitle: res.bodyPartsTitle,
    status: 'COMPLETED',
    notes: res.notes,
  }
}

export function useWorkoutPage() {
  const now = new Date()
  const currentYear = ref(now.getFullYear())
  const currentMonth = ref(now.getMonth() + 1)
  const todayDateStr = formatLocalYmd(now)
  const selectedDateStr = ref(todayDateStr)
  const modalVisible = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const formSeed = ref<WorkoutFormSeed | null>(null)
  const workoutMap = ref<Record<string, { bodyPartBadge: string }>>({})
  const monthNotice = ref<MonthNotice>('none')
  const loadedMonthKey = ref<string | null>(null)
  const detailPhase = ref<WorkoutDetailPhase>('loading')
  const currentDetail = ref<DayWorkoutDetail | null>(null)
  let dayToken = 0

  const monthKey = () => `${currentYear.value}-${currentMonth.value}`

  const actionDisabled = computed(() => detailPhase.value === 'loading' || detailPhase.value === 'error')
  const actionText = computed(() => {
    if (detailPhase.value === 'loading') return '正在读取'
    if (detailPhase.value === 'error') return '请先重试'
    if (detailPhase.value === 'ready') return '修改这次训练'
    return '添加今日训练'
  })

  async function loadMonthData() {
    const key = monthKey()
    const sameMonth = loadedMonthKey.value === key
    if (!sameMonth) workoutMap.value = {}
    try {
      const list = await getWorkoutMonth(currentYear.value, currentMonth.value, true)
      const map: Record<string, { bodyPartBadge: string }> = {}
      for (const item of list ?? []) {
        if (!map[item.date]) map[item.date] = { bodyPartBadge: item.bodyPartBadge }
      }
      workoutMap.value = map
      loadedMonthKey.value = key
      monthNotice.value = 'none'
    } catch {
      monthNotice.value = sameMonth ? 'stale' : 'miss'
      if (!sameMonth) workoutMap.value = {}
    }
  }

  async function loadDayDetail(dateStr: string, options?: { immediate?: boolean; keepOnError?: boolean }) {
    const token = ++dayToken
    if (options?.immediate !== false) {
      detailPhase.value = 'loading'
      currentDetail.value = null
    }
    try {
      const res = await getWorkoutDay(dateStr, true)
      if (token !== dayToken || selectedDateStr.value !== dateStr) return
      if (res) {
        currentDetail.value = mapDetail(res)
        detailPhase.value = 'ready'
      } else {
        currentDetail.value = null
        detailPhase.value = 'rest'
      }
    } catch {
      if (token !== dayToken || selectedDateStr.value !== dateStr) return
      if (options?.keepOnError && currentDetail.value?.date === dateStr) {
        detailPhase.value = 'ready'
        return
      }
      currentDetail.value = null
      detailPhase.value = 'error'
    }
  }

  async function ensureAndRefresh() {
    if (!getToken()) {
      detailPhase.value = 'loading'
      currentDetail.value = null
      try {
        await loginDev('test-user-001')
      } catch {
        detailPhase.value = 'error'
        monthNotice.value = 'miss'
        workoutMap.value = {}
        return
      }
    }
    const showLoading = detailPhase.value === 'loading' || detailPhase.value === 'error'
    await Promise.all([
      loadMonthData(),
      loadDayDetail(selectedDateStr.value, { immediate: showLoading }),
    ])
  }

  function handleSelectDate(dateStr: string) {
    selectedDateStr.value = dateStr
    void loadDayDetail(dateStr)
  }

  async function shiftMonth(delta: number) {
    const next = currentMonth.value + delta
    if (next < 1) {
      currentYear.value -= 1
      currentMonth.value = 12
    } else if (next > 12) {
      currentYear.value += 1
      currentMonth.value = 1
    } else {
      currentMonth.value = next
    }
    await loadMonthData()
  }

  function openAddModal() {
    if (detailPhase.value !== 'rest' && detailPhase.value !== 'ready') return
    const initial = resolveFormInitial(detailPhase.value === 'ready' ? currentDetail.value : null)
    formSeed.value = {
      date: selectedDateStr.value,
      editing: initial.editing,
      bodyParts: initial.bodyParts,
      duration: initial.duration,
      notes: initial.notes,
      unresolvedTitle: initial.unresolvedTitle,
    }
    modalVisible.value = true
  }

  async function retryMonth() {
    if (!getToken()) {
      await ensureAndRefresh()
      return
    }
    await loadMonthData()
  }

  async function retryDay() {
    if (!getToken()) {
      await ensureAndRefresh()
      return
    }
    await loadDayDetail(selectedDateStr.value)
  }

  function onActionTap() {
    if (actionDisabled.value) return
    openAddModal()
  }

  async function handleSaveWorkout(form: AddWorkoutForm) {
    if (saving.value) return
    saving.value = true
    try {
      const saved = await saveWorkout({
        date: form.date,
        duration: form.duration,
        bodyParts: form.bodyParts.join(' & '),
        notes: form.notes,
      }, true)
      currentDetail.value = mapDetail(saved)
      detailPhase.value = 'ready'
      selectedDateStr.value = saved.date
      modalVisible.value = false
      uni.showToast({ title: '打卡记录保存成功', icon: 'none' })
      await Promise.all([
        loadMonthData(),
        loadDayDetail(saved.date, { immediate: false, keepOnError: true }),
      ])
    } catch (err) {
      uni.showToast({ title: readErrorMessage(err, '没保存上，请再试一次'), icon: 'none' })
    } finally {
      saving.value = false
    }
  }

  function confirmDelete() {
    const recordId = currentDetail.value?.recordId
    if (detailPhase.value !== 'ready' || !recordId || deleting.value) return
    uni.showModal({
      title: '删除这条记录',
      content: '删除后，这一天会回到休息。首页下次打开也不再显示。',
      confirmText: '删除',
      cancelText: '取消',
      success: (result) => {
        if (result.confirm) void performDelete(recordId)
      },
    })
  }

  async function performDelete(recordId: string) {
    deleting.value = true
    try {
      await deleteWorkout(recordId, true)
      await Promise.all([
        loadMonthData(),
        loadDayDetail(selectedDateStr.value),
      ])
    } catch (err) {
      uni.showToast({ title: readErrorMessage(err, '没删掉，记录还在'), icon: 'none' })
    } finally {
      deleting.value = false
    }
  }

  onShow(() => {
    void ensureAndRefresh()
  })

  return {
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
    handlePrevMonth: () => shiftMonth(-1),
    handleNextMonth: () => shiftMonth(1),
    retryMonth,
    retryDay,
    openAddModal,
    onActionTap,
    handleSaveWorkout,
    confirmDelete,
  }
}
