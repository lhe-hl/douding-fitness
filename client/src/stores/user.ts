import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const nickname = ref('晨曦')
  const avatarUrl = ref('https://api.dicebear.com/7.x/bottts/svg?seed=douding')
  const streakDays = ref(5)
  const isLoggedIn = ref(false)

  function setToken(val: string) {
    token.value = val
    isLoggedIn.value = !!val
  }

  function applyLogin(session: { token: string; nickname?: string; avatarUrl?: string }) {
    setToken(session.token)
    if (session.nickname) nickname.value = session.nickname
    if (session.avatarUrl) avatarUrl.value = session.avatarUrl
  }

  return {
    token,
    nickname,
    avatarUrl,
    streakDays,
    isLoggedIn,
    setToken,
    applyLogin,
  }
})
