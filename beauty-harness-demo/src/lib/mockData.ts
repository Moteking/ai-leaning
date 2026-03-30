import { Customer, Booking, AutomationLog } from './types'

export const customers: Customer[] = [
  {
    id: '1',
    name: '田中さくら',
    treatment: 'ネイル',
    source: 'hpb',
    visitIntervalDays: 35,
    cancelCount: 0,
    lastVisit: '2026-02-23',
    nextPredicted: '2026-03-30',
  },
  {
    id: '2',
    name: '鈴木あおい',
    treatment: 'カラー',
    source: 'hpb',
    visitIntervalDays: 28,
    cancelCount: 2,
    lastVisit: '2026-03-02',
    nextPredicted: '2026-03-30',
  },
  {
    id: '3',
    name: '山田ゆい',
    treatment: 'トリートメント',
    source: 'own',
    visitIntervalDays: 42,
    cancelCount: 0,
    lastVisit: '2026-02-16',
    nextPredicted: '2026-03-30',
  },
  {
    id: '4',
    name: '佐藤みな',
    treatment: 'ハイライト',
    source: 'hpb',
    visitIntervalDays: 21,
    cancelCount: 0,
    lastVisit: '2026-03-09',
    nextPredicted: '2026-03-30',
  },
]

export const todayBookings: Booking[] = [
  {
    id: 'b1',
    customer: customers[0],
    time: '10:00',
    treatment: 'ネイル（ジェル）',
    price: 8800,
    status: 'waiting',
  },
  {
    id: 'b2',
    customer: customers[1],
    time: '11:30',
    treatment: 'カラー（フルカラー）',
    price: 12000,
    status: 'waiting',
  },
  {
    id: 'b3',
    customer: customers[2],
    time: '14:00',
    treatment: 'トリートメント',
    price: 6500,
    status: 'waiting',
  },
  {
    id: 'b4',
    customer: customers[3],
    time: '16:00',
    treatment: 'ハイライト＋カット',
    price: 15000,
    status: 'waiting',
  },
]

export const automationLogs: AutomationLog[] = [
  {
    id: 'log1',
    customerName: '高橋れい',
    action: 'お礼LINE送信',
    timestamp: '09:45',
    status: 'success',
  },
  {
    id: 'log2',
    customerName: '高橋れい',
    action: 'リマインド設定（4/15）',
    timestamp: '09:45',
    status: 'success',
  },
  {
    id: 'log3',
    customerName: '中村ひな',
    action: 'HPB→自社誘導LINE送信',
    timestamp: '09:30',
    status: 'success',
  },
]

// HPB手数料は1件あたり約2,000円として計算
export const HPB_FEE_PER_BOOKING = 2000

export const monthlyStats = {
  revenue: 892000,
  bookingCount: 68,
  repeatRate: 72,
  hpbCount: 41,
  ownCount: 27,
  hpbFeeTotal: 41 * HPB_FEE_PER_BOOKING, // 82,000円
}
