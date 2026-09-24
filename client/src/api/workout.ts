import { request } from './request'

// 获取打卡记录
export function getWorkoutRecords(date?: string) {
  return request({
    url: `/workout${date ? `?date=${date}` : ''}`,
    method: 'GET',
  })
}

// 提交健身打卡
export function submitWorkoutRecord(data: any) {
  return request({
    url: '/workout',
    method: 'POST',
    data,
  })
}
