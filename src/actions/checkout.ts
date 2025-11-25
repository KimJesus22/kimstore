'use server';

import { stripe } from '@/lib/stripe';
import { cartService } from '@/services/cart.service';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

const TEST_USER_ID = 'user-123'; // TODO: Replace with actual auth

export async function createCheckoutSession() {
    const userId = TEST_USER_ID;

    // 1. Validate Stock
    const stockValidation = await cartService.validateCartStock(userId);
    if (!stockValidation.valid) {
        throw new Error(`Stock insuficiente para: ${stockValidation.issues.map(i => i.productName).join(', ')}`);
    }

    // 2. Get Cart
    const { cart, totals } = await cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
        throw new Error('El carrito está vacío');
    }

    // 3. Ensure User Exists (for demo purposes)
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                id: userId,
                email: 'test@example.com',
                password: 'hashed_password', // Placeholder
                name: 'Test User',
            },
        });
    }

    // 4. Create Order in DB
    const order = await prisma.order.create({
        data: {
            userId: userId,
            total: totals.total,
            status: 'pending',
            items: {
                create: cart.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
            },
        },
    });

    // 5. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cart.items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.product.name,
                    images: item.product.image ? [item.product.image] : [],
                },
                unit_amount: Math.round(item.product.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        metadata: {
            orderId: order.id,
            userId: userId,
        },
    });

    if (!session.url) {
        throw new Error('Error al crear la sesión de pago');
    }

    redirect(session.url);
}
