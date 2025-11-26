-- CreateIndex
-- Índices estratégicos para optimización de queries

-- ============================================
-- TABLA: User
-- ============================================

-- Índice para filtrar usuarios por rol (admin queries)
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

-- ============================================
-- TABLA: Product
-- ============================================

-- Índices compuestos para queries frecuentes con ordenamiento
CREATE INDEX IF NOT EXISTS "Product_category_createdAt_idx" ON "Product"("category", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Product_featured_createdAt_idx" ON "Product"("featured", "createdAt" DESC);

-- Índice compuesto para filtrado por categoría y precio
CREATE INDEX IF NOT EXISTS "Product_category_price_idx" ON "Product"("category", "price");

-- Índice para ordenamiento por precio
CREATE INDEX IF NOT EXISTS "Product_price_idx" ON "Product"("price");

-- Índice para filtrar productos en stock
CREATE INDEX IF NOT EXISTS "Product_stock_idx" ON "Product"("stock");

-- Índice para ordenamiento por fecha de creación
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt" DESC);

-- ============================================
-- TABLA: CartItem
-- ============================================

-- Índices para joins eficientes
CREATE INDEX IF NOT EXISTS "CartItem_cartId_idx" ON "CartItem"("cartId");
CREATE INDEX IF NOT EXISTS "CartItem_productId_idx" ON "CartItem"("productId");

-- ============================================
-- TABLA: Order
-- ============================================

-- Índice compuesto para historial de órdenes del usuario
CREATE INDEX IF NOT EXISTS "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt" DESC);

-- Índice compuesto para órdenes por estado (admin dashboard)
CREATE INDEX IF NOT EXISTS "Order_status_createdAt_idx" ON "Order"("status", "createdAt" DESC);

-- Índice para reportes por fecha
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt" DESC);

-- ============================================
-- TABLA: OrderItem
-- ============================================

-- Índices para joins y analytics
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");

-- ============================================
-- ÍNDICES AVANZADOS (OPCIONAL)
-- ============================================

-- Índice GIN para búsqueda de texto completo en productos
-- Requiere extensión pg_trgm para búsquedas ILIKE eficientes
-- Descomentar si necesitas búsqueda de texto:

-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS "Product_name_trgm_idx" ON "Product" USING gin (name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS "Product_description_trgm_idx" ON "Product" USING gin (description gin_trgm_ops);

-- Índice GIN para búsqueda en JSON specs
-- Descomentar si necesitas buscar en especificaciones:

-- CREATE INDEX IF NOT EXISTS "Product_specs_idx" ON "Product" USING gin (specs);

-- ============================================
-- VERIFICACIÓN DE ÍNDICES
-- ============================================

-- Para verificar que los índices se crearon correctamente:
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Product' ORDER BY indexname;
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'User' ORDER BY indexname;
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'CartItem' ORDER BY indexname;
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Order' ORDER BY indexname;
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'OrderItem' ORDER BY indexname;

-- Para ver el tamaño de los índices:
-- SELECT
--     schemaname,
--     tablename,
--     indexname,
--     pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
-- FROM pg_stat_user_indexes
-- ORDER BY pg_relation_size(indexrelid) DESC;
