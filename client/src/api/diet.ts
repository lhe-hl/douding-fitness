import { request } from './request'

// 获取饮食记录
export function getDietRecords(date?: string) {
  return request({
    url: `/diet${date ? `?date=${date}` : ''}`,
    method: 'GET',
  })
}

// 提交饮食打卡
export function submitDietRecord(data: any) {
  return request({
    url: '/diet',
    method: 'POST',
    data,
  })
}
