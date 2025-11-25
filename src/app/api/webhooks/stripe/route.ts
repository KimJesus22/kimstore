import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { cartService } from '@/services/cart.service';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (!orderId || !userId) {
            return new NextResponse('Webhook Error: Missing metadata', { status: 400 });
        }

        // Update Order
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'paid',
            },
        });

        // Clear Cart
        await cartService.clearCart(userId);
    }

    return new NextResponse(null, { status: 200 });
}
