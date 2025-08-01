# BookLend API

REST API para la aplicación de préstamo de libros BookLend.

## Configuración

### Prerequisitos

- Node.js (v18 o superior)
- Yarn (v4.1.1)

### Instalación

Desde la raíz del proyecto:

```bash
yarn install
```

### Variables de entorno

El archivo `.env` ya está configurado con valores por defecto:

```
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Desarrollo

### Levantar la API

Desde la raíz del proyecto:

```bash
yarn api:dev
```

O directamente en la carpeta de la API:

```bash
cd apps/api
yarn dev
```

### Probar los endpoints

#### Health Check Principal

```bash
curl http://localhost:3001
```

Respuesta esperada:

```json
{
  "message": "BookLend API is running",
  "version": "0.0.1",
  "timestamp": "2025-08-01T00:20:00.000Z"
}
```

#### Health Check de la API

```bash
curl http://localhost:3001/api/health
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2025-08-01T00:20:00.000Z"
}
```

#### Endpoints de Libros

**Obtener todos los libros:**

```bash
curl http://localhost:3001/api/books
```

**Obtener libros populares:**

```bash
curl http://localhost:3001/api/books/popular
```

#### Endpoints de Autores

**Obtener todos los autores:**

```bash
curl http://localhost:3001/api/authors
```

**Crear autor (demo):**

```bash
curl -X POST http://localhost:3001/api/authors
```

## Scripts disponibles

- `yarn dev` - Ejecuta la API en modo desarrollo con hot reload
- `yarn build` - Compila el código TypeScript
- `yarn start` - Ejecuta la API compilada
- `yarn test` - Ejecuta las pruebas
- `yarn type-check` - Verifica los tipos de TypeScript

## Estructura del proyecto

```
apps/api/
├── src/
│   ├── app.ts           # Archivo principal de la aplicación
│   └── constants.ts     # Constantes y configuración
├── .env                 # Variables de entorno
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
├── tsconfig.app.json    # Configuración para compilación
└── README.md           # Este archivo
```

## Integración con el Dominio

La API utiliza un sistema de exports limpio del dominio que permite importar cualquier funcionalidad de forma organizada:

```typescript
import {
  // ============= ENTITIES =============
  Book,
  Author,
  User,
  BookStatus,

  // ============= USE CASES =============
  getPopularBooks,
  createAuthor,
  updateAuthor,
  deleteAuthor,

  // ============= SERVICES =============
  BookService,
  AuthorService,
  UserService,

  // ============= MOCK SERVICES =============
  mockBookService,
  mockAuthorService,
  mockUserService,

  // ============= TYPES =============
  UUID,
  Email,

  // ============= UTILS =============
  trimOrNull,
  authorization,

  // ============= VALIDATIONS =============
  validateAndNormalizeEmail,
  validateBirthDeathDates,
} from 'app-domain';
```

### Beneficios del Sistema de Exports Limpio:

- ✅ **Un solo import** para toda la funcionalidad del dominio
- ✅ **Organización clara** por categorías
- ✅ **IntelliSense completo** en el IDE
- ✅ **Fácil mantenimiento** - no más exports manuales uno por uno
- ✅ **Escalabilidad** - automáticamente incluye nuevas funcionalidades

## Próximos pasos

1. ✅ ~~Integrar con el dominio (`app-domain`)~~ - **COMPLETADO**
2. ✅ ~~Agregar controladores y rutas~~ - **COMPLETADO**
3. Implementar middlewares de autenticación
4. Agregar pruebas unitarias
5. Configurar base de datos
