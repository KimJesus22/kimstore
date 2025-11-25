import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="bg-green-50 p-8 rounded-lg shadow-md text-center max-w-md w-full border border-green-200">
                <h1 className="text-3xl font-bold text-green-700 mb-4">¡Pago Exitoso!</h1>
                <p className="text-gray-700 mb-6">
                    Gracias por tu compra. Hemos recibido tu pedido correctamente.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                    Volver a la Tienda
                </Link>
            </div>
        </div>
    );
}
