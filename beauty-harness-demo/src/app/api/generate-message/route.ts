import { NextRequest, NextResponse } from 'next/server'
import { customers } from '@/lib/mockData'
import {
  generateThanksMessage,
  generateReviewRequest,
  generateRepeatPromotion,
  generateHpbRedirect,
} from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { customerId, treatment } = await req.json()
    const customer = customers.find((c) => c.id === customerId)

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const [thanks, reviewRequest, repeatPromotion] = await Promise.all([
      generateThanksMessage(customer, treatment),
      generateReviewRequest(customer),
      generateRepeatPromotion(customer),
    ])

    let hpbRedirect: string | undefined
    if (customer.source === 'hpb') {
      hpbRedirect = await generateHpbRedirect(customer)
    }

    return NextResponse.json({
      thanks,
      reviewRequest,
      repeatPromotion,
      hpbRedirect,
    })
  } catch (error) {
    console.error('Message generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate messages' },
      { status: 500 }
    )
  }
}
