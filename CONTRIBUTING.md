# Guía de Contribución

¡Gracias por tu interés en contribuir a KimStore! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Ejecución de Tests](#ejecución-de-tests)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Features](#solicitar-features)

## 🤝 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas un ambiente respetuoso y profesional.

### Expectativas

- Usa un lenguaje acogedor e inclusivo
- Respeta los diferentes puntos de vista y experiencias
- Acepta críticas constructivas con gracia
- Enfócate en lo que es mejor para la comunidad

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub, luego:
git clone https://github.com/TU_USUARIO/pc-store.git
cd pc-store
```

### 2. Crea una Rama

```bash
git checkout -b feature/mi-nueva-funcionalidad
# o
git checkout -b fix/correccion-de-bug
```

### 3. Realiza tus Cambios

Asegúrate de seguir los [estándares de código](#estándares-de-código).

### 4. Commit

Usa mensajes de commit descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: agregar funcionalidad de búsqueda de productos"
git commit -m "fix: corregir cálculo de total en carrito"
git commit -m "docs: actualizar README con instrucciones de deployment"
```

**Tipos de commit:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

### 5. Push y Pull Request

```bash
git push origin feature/mi-nueva-funcionalidad
```

Luego crea un Pull Request en GitHub usando la plantilla proporcionada.

## ⚙️ Configuración del Entorno

### Requisitos Previos

- Node.js 20 o superior
- npm o yarn
- PostgreSQL (para desarrollo local)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# Configurar base de datos
npx prisma generate
npx prisma db push

# Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`.

## 📝 Estándares de Código

### Linting y Formato

Este proyecto usa ESLint y Prettier para mantener la calidad del código.

```bash
# Ejecutar linter
npm run lint

# Corregir problemas automáticamente
npm run lint:fix

# Verificar formato
npm run format:check

# Formatear código
npm run format
```

### Convenciones de Código

- **TypeScript**: Usa tipos explícitos siempre que sea posible
- **Nombres**: 
  - Componentes: `PascalCase` (ej: `ProductCard`)
  - Funciones/variables: `camelCase` (ej: `calculateTotal`)
  - Constantes: `UPPER_SNAKE_CASE` (ej: `MAX_ITEMS`)
- **Imports**: Ordena los imports (externos primero, luego internos)
- **Comentarios**: Escribe comentarios en español para funciones complejas

### Estructura de Archivos

```
src/
├── app/              # Rutas de Next.js (App Router)
├── components/       # Componentes React
│   ├── products/     # Componentes específicos de productos
│   └── ui/           # Componentes UI reutilizables
├── lib/              # Utilidades y helpers
├── repositories/     # Capa de acceso a datos
├── services/         # Lógica de negocio
├── schemas/          # Esquemas de validación (Zod)
└── types/            # Definiciones de tipos TypeScript
```

## 🔄 Proceso de Pull Request

### Antes de Crear el PR

1. **Actualiza tu rama** con los últimos cambios de `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout tu-rama
   git rebase main
   ```

2. **Ejecuta todos los checks**:
   ```bash
   npm run lint
   npm run format:check
   npm run type-check
   npm run test:ci
   ```

3. **Asegúrate de que el build funcione**:
   ```bash
   npm run build
   ```

### Checklist del PR

Tu Pull Request debe:

- [ ] Tener un título descriptivo
- [ ] Incluir descripción detallada de los cambios
- [ ] Referenciar issues relacionados (ej: "Closes #123")
- [ ] Pasar todos los checks del CI
- [ ] Incluir tests para nuevas funcionalidades
- [ ] Actualizar documentación si es necesario
- [ ] No tener conflictos con `main`
- [ ] Tener commits con mensajes claros

### Revisión de Código

- Los PRs requieren al menos una aprobación
- Responde a los comentarios de revisión de manera constructiva
- Realiza los cambios solicitados en commits adicionales
- Una vez aprobado, el PR será merged por un maintainer

## 🧪 Ejecución de Tests

### Ejecutar Tests

```bash
# Modo watch (desarrollo)
npm run test

# Ejecutar una vez con coverage
npm run test:ci

# Ejecutar tests específicos
npm run test -- ProductCard.test.tsx
```

### Escribir Tests

- Coloca los tests junto al archivo que prueban: `Component.test.tsx`
- Usa nombres descriptivos para los tests
- Sigue el patrón AAA (Arrange, Act, Assert)

**Ejemplo:**

```typescript
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    // Arrange
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      price: 100,
      // ...
    };

    // Act
    render(<ProductCard product={mockProduct} />);

    // Assert
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

### Coverage

Mantenemos un objetivo de coverage mínimo del 70%. Puedes ver el reporte de coverage después de ejecutar `npm run test:ci`.

## 🐛 Reportar Bugs

Si encuentras un bug, por favor:

1. **Verifica** que no exista un issue similar
2. **Usa la plantilla** de Bug Report
3. **Incluye**:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es posible
   - Información del entorno (OS, navegador, versión de Node)

## ✨ Solicitar Features

Para proponer nuevas funcionalidades:

1. **Verifica** que no exista una solicitud similar
2. **Usa la plantilla** de Feature Request
3. **Describe**:
   - El problema que resuelve
   - La solución propuesta
   - Alternativas consideradas
   - Impacto en usuarios

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vitest Documentation](https://vitest.dev)

## 💬 ¿Preguntas?

Si tienes preguntas sobre cómo contribuir, no dudes en:

- Abrir un issue con la etiqueta `question`
- Contactar a los maintainers

---

¡Gracias por contribuir a KimStore! 🎉
