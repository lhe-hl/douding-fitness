import { request } from './request'

// 请求 AI 减脂建议与对话
export function askAiCoach(question: string) {
  return request({
    url: '/ai/chat',
    method: 'POST',
    data: { question },
  })
}
