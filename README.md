# BookLend - Clean Architecture Project

Este proyecto implementa un sistema de préstamo de libros utilizando **Arquitectura Limpia** con TypeScript, monorepo y herramientas de desarrollo modernas.

## 🏗️ Arquitectura

El proyecto sigue los principios de Clean Architecture con una estructura simplificada:

### Domain Package

- **`domain`** - Capa de Dominio
  - **`entities/`** - Entidades de negocio y reglas de dominio
  - **`repositories/`** - Interfaces de repositorios
  - **`use-cases/`** - Casos de uso y lógica de aplicación
  - **`src/`** - Exports y configuración del paquete

## 🛠️ Tecnologías

- **TypeScript** - Lenguaje principal
- **Yarn Workspaces** - Gestión de monorepo
- **Vitest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **Husky** - Git hooks
- **lint-staged** - Pre-commit hooks

## 📦 Scripts Disponibles

### Root Level

```bash
# Instalar dependencias
yarn install

# Build de todos los packages
yarn build

# Ejecutar tests en todos los packages
yarn test

# Linting
yarn lint
yarn lint:fix

# Formateo
yarn format
yarn format:check

# Type checking
yarn type-check

# Verificación completa (linting + formateo + tipos + build + tests)
yarn verify
```

### Package Level

Cada package tiene sus propios scripts que se pueden ejecutar individualmente:

```bash
# Ejecutar en el dominio
yarn workspace domain test
yarn workspace domain build
```

## 🚀 Configuración Inicial

1. **Instalar dependencias:**

   ```bash
   yarn install
   ```

2. **Configurar Husky:**

   ```bash
   yarn prepare
   ```

3. **Ejecutar tests:**

   ```bash
   yarn test
   ```

4. **Build del proyecto:**
   ```bash
   yarn build
   ```

## 🔧 Herramientas de Desarrollo

### Husky & Lint-staged

Configurado para ejecutar automáticamente antes de cada commit:

- **ESLint** - Análisis de código
- **Prettier** - Formateo automático
- **Type checking** - Verificación de tipos

### Git Hooks

El proyecto incluye varios hooks de Git para garantizar la calidad del código:

- **pre-commit**: Ejecuta linting, formateo y verificación de tipos en archivos staged
- **commit-msg**: Valida que los mensajes de commit sigan el formato de Conventional Commits
- **pre-push**: Ejecuta verificación completa antes del push:
  - `yarn install --frozen-lockfile` - Instala dependencias
  - `yarn lint:check` - Verifica linting sin arreglar
  - `yarn format:check` - Verifica formateo sin arreglar
  - `yarn type-check` - Verifica tipos TypeScript
  - `yarn build` - Compila el proyecto
  - `yarn test` - Ejecuta todos los tests

#### Formato de Commits

Se requiere el formato de Conventional Commits:

```
type(scope): description
```

Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`, `revert`

Ejemplos:

- `feat: add user authentication`
- `fix(domain): handle null book response`
- `test: add unit tests for Book entity`

## 📁 Estructura del Proyecto

```
BookLend/
├── domain/              # Capa de Dominio
│   ├── entities/        # Entidades de negocio
│   │   ├── Book.ts
│   │   └── Book.test.ts
│   ├── repositories/    # Interfaces de repositorios
│   │   └── BookRepository.ts
│   ├── use-cases/       # Casos de uso
│   │   └── LendBookUseCase.ts
│   ├── src/             # Exports del dominio
│   │   └── index.ts
│   ├── dist/            # Archivos compilados
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.lib.json
│   └── vitest.config.ts
├── package.json         # Root package
├── tsconfig.json        # TypeScript config
├── .eslintrc.json       # ESLint config
├── .prettierrc          # Prettier config
└── vitest.config.ts     # Vitest config
```

## 🧪 Testing

Los tests están configurados con Vitest y incluyen:

- Tests unitarios para entidades de dominio
- Tests de casos de uso
- Cobertura de código automática

## 📋 Próximos Pasos

1. Implementar más entidades de dominio
2. Crear una aplicación web/API en el directorio `apps/`
3. Añadir persistencia real (base de datos)
4. Implementar autenticación y autorización
5. Añadir logging y monitoring

## 🤝 Contribuir

1. Seguir las convenciones de código establecidas
2. Escribir tests para nueva funcionalidad
3. Asegurar que pasan todas las verificaciones antes del commit
4. Mantener la separación de responsabilidades entre capas
