import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const nickname = ref('晨曦')
  const avatarUrl = ref('https://api.dicebear.com/7.x/bottts/svg?seed=douding')
  const streakDays = ref(5)
  const isLoggedIn = ref(true)

  function setToken(val: string) {
    token.value = val
    isLoggedIn.value = !!val
  }

  return {
    token,
    nickname,
    avatarUrl,
    streakDays,
    isLoggedIn,
    setToken,
  }
})
