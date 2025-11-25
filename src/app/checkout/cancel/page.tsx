import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-red-50 p-8 rounded-lg shadow-md text-center max-w-md w-full border border-red-200">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Pago Cancelado</h1>
        <p className="text-gray-700 mb-6">
          El proceso de pago ha sido cancelado. No se ha realizado ningún cargo a tu tarjeta.
        </p>
        <Link
          href="/carrito"
          className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
        >
          Volver al Carrito
        </Link>
      </div>
    </div>
  );
}
