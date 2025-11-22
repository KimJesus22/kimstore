export default function ProductDetailPage({ params }: { params: { id: string } }) {
    return (
        <main>
            <div className="container" style={{ paddingTop: '4rem' }}>
                <h1>Detalles del Producto: {params.id}</h1>
                <p>Aquí se mostrará la información detallada del producto.</p>
            </div>
        </main>
    );
}
