import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDietStore = defineStore('diet', () => {
  // 今日已摄入与目标热量
  const currentCalories = ref(1450)
  const targetCalories = ref(1800)
  const deficitText = ref('热量缺口状态')

  // 宏量营养素
  const macros = ref({
    protein: { name: '蛋白质', current: 75, target: 100, color: '#70C536', displayValue: '1800 kcal' },
    carbs: { name: '碳糖质', current: 48, target: 100, color: '#FFA238', displayValue: '30/0%' },
    fat: { name: '脂肪', current: 28, target: 100, color: '#FF5E3A', displayValue: '10/5%' },
  })

  // 记录饮食
  function addCalories(amount: number) {
    currentCalories.value += amount
  }

  return {
    currentCalories,
    targetCalories,
    deficitText,
    macros,
    addCalories,
  }
})
