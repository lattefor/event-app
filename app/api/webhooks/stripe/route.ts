import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()

  const sig = request.headers.get('stripe-signature') as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ message: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const { id, amount_total, metadata } = event.data.object

    console.log('Processing successful payment:', { id, amount_total, metadata })

    try {
      const order = {
        stripeId: id,
        eventId: metadata?.eventId || '',
        buyerId: metadata?.buyerId || '',
        totalAmount: (amount_total ? (amount_total / 100).toString() : '0'),
        createdAt: new Date(),
      }

      const newOrder = await createOrder(order)
      console.log('Order created successfully:', newOrder)
      return NextResponse.json({ message: 'OK', order: newOrder })
    } catch (error) {
      console.error('Failed to create order:', error)
      return NextResponse.json({ message: 'Failed to create order' }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'OK' })
}