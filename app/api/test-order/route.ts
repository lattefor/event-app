import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'

export async function POST() {
  try {
    const testOrder = {
      stripeId: 'test_' + Date.now(),
      eventId: '686716841b97380afa4ba673', // Use a real event ID from your DB
      buyerId: '6861b8a499beda03edc60caa', // Use a real user ID from your DB
      totalAmount: '25.00',
      createdAt: new Date(),
    }

    const newOrder = await createOrder(testOrder)
    return NextResponse.json({ success: true, order: newOrder })
  } catch (error) {
    console.error('Test order creation failed:', error)
    return NextResponse.json({ success: false, error: error }, { status: 500 })
  }
}