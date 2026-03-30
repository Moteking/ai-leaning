export type BookingSource = 'hpb' | 'own'

export interface Customer {
  id: string
  name: string
  treatment: string
  source: BookingSource
  visitIntervalDays: number
  cancelCount: number
  lastVisit: string
  nextPredicted: string
}

export interface Booking {
  id: string
  customer: Customer
  time: string
  treatment: string
  price: number
  status: 'waiting' | 'in-progress' | 'completed'
}

export interface AutomationStep {
  id: number
  label: string
  status: 'pending' | 'running' | 'done'
  detail?: string
}

export interface GeneratedMessages {
  thanks: string
  reviewRequest: string
  repeatPromotion: string
  hpbRedirect?: string
}

export interface PhotoAnalysis {
  color: string
  style: string
  technique: string
  caption: string
  hashtags: string[]
}

export interface AutomationLog {
  id: string
  customerName: string
  action: string
  timestamp: string
  status: 'success' | 'pending'
}
