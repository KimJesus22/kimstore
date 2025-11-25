import { cartService } from '@/services/cart.service';
import { createCheckoutSession } from '@/actions/checkout';
import Link from 'next/link';
import Image from 'next/image';

export default async function CartPage() {
  const userId = 'user-123'; // TODO: Reemplazar con autenticación real
  const { cart, totals } = await cartService.getCart(userId);

  if (!cart || cart.items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600 mb-6">El carrito está vacío actualmente.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Explorar Productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm">
              <div className="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden relative">
                {item.product.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-gray-600">Precio: €{item.product.price.toFixed(2)}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                  {/* Future: Add quantity controls here */}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  €{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

            <div className="space-y-2 mb-4 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>€{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos</span>
                <span>€{totals.tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>€{totals.total.toFixed(2)}</span>
            </div>

            <form action={createCheckoutSession}>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Pagar con Stripe
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Pagos seguros procesados por Stripe
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
