# InvenTech

Sistema de gestión de inventario full-stack compuesto por una API REST en **Express + MySQL** y un cliente web en **Angular**. Permite administrar productos, proveedores, usuarios y movimientos de stock (entradas/salidas), con autenticación basada en JWT.

## Stack técnico

| Capa       | Tecnología                                                                 |
|------------|-----------------------------------------------------------------------------|
| Frontend   | Angular 21, RxJS, Tailwind CSS, ngx-toastr, SweetAlert2                    |
| Backend    | Node.js, Express 5, MySQL (mysql2), JWT, bcryptjs, Zod (validación)        |
| Base de datos | MySQL 8, orquestada con Docker Compose                                 |
| Monorepo   | npm workspaces (`frontend`, `backend`, `types`)                            |
| Despliegue | Vercel (frontend)                                                          |

## Estructura del proyecto

```
proyecto-angular/
├── backend/               # API REST (Express)
│   ├── database/          # schema.sql y seed.sql para MySQL
│   └── src/
│       ├── config/        # conexión a base de datos
│       ├── controllers/   # lógica de negocio por entidad
│       ├── middlewares/   # auth (JWT) y validación de requests
│       ├── models/        # acceso a datos
│       ├── routes/        # definición de endpoints
│       └── validations/   # esquemas Zod
├── frontend/               # Aplicación Angular
│   └── src/
│       ├── app/            # configuración, rutas y guards
│       ├── pages/          # login, dashboard, inventario, proveedores, usuarios, movimientos
│       ├── components/     # componentes reutilizables
│       └── service/        # servicios HTTP hacia la API
├── types/                   # tipos TypeScript compartidos (@inven-tech/types)
└── docker-compose.yml       # contenedor MySQL para desarrollo
```

## Funcionalidades

- **Autenticación**: login con email/usuario y contraseña, sesión mediante cookie httpOnly con JWT, roles `ADMIN` y `EMPLOYEE`.
- **Productos**: alta, edición, baja y consulta de productos con SKU, precio, stock y proveedor asociado.
- **Proveedores**: gestión de proveedores (nombre, contacto, dirección).
- **Usuarios**: administración de usuarios y roles.
- **Movimientos de inventario**: registro de entradas y salidas de stock por producto, con trazabilidad del usuario que las realiza.

## Requisitos previos

- [Node.js](https://nodejs.org/) 20+ y npm 10+
- [Docker](https://www.docker.com/) y Docker Compose (para la base de datos MySQL)

## Puesta en marcha

### 1. Clonar e instalar dependencias

Este repositorio usa **npm workspaces**, por lo que una sola instalación en la raíz resuelve las dependencias de `frontend`, `backend` y `types`:

```bash
git clone https://github.com/SamuelCev/proyecto-angular.git
cd proyecto-angular
npm install
```

### 2. Levantar la base de datos

```bash
docker compose up -d
```

Esto crea un contenedor MySQL en el puerto `3306` e inicializa la base `inventech` con el esquema (`backend/database/schema.sql`) y datos de ejemplo (`backend/database/seed.sql`).

### 3. Configurar variables de entorno del backend

Copia el archivo de ejemplo y ajusta los valores si es necesario:

```bash
cp backend/.env.example backend/.env
```

Variables disponibles:

| Variable      | Descripción                          |
|---------------|---------------------------------------|
| `DB_HOST`     | Host de MySQL                         |
| `DB_PORT`     | Puerto de MySQL                       |
| `DB_USER`     | Usuario de la base de datos           |
| `DB_PASSWORD` | Contraseña de la base de datos        |
| `DB_NAME`     | Nombre de la base de datos            |
| `PORT`        | Puerto en el que corre la API         |
| `JWT_SECRET`  | Secreto para firmar los tokens JWT    |
| `CORS_ORIGIN` | Orígenes adicionales permitidos por CORS (separados por coma) |

### 4. Ejecutar backend y frontend

```bash
# API en modo desarrollo (http://localhost:3000)
npm run dev:backend

# Cliente Angular (http://localhost:4200)
npm run start:frontend
```

El frontend consume la API mediante la URL configurada en `frontend/src/environments/environment.ts` (desarrollo) y `environment.prod.ts` (producción).

## Scripts disponibles (raíz)

| Script                  | Descripción                                  |
|--------------------------|-----------------------------------------------|
| `npm run start:backend`  | Inicia la API en modo producción              |
| `npm run dev:backend`    | Inicia la API con recarga automática          |
| `npm run start:frontend` | Inicia el servidor de desarrollo de Angular   |
| `npm run build:frontend` | Compila el frontend para producción           |

## API — endpoints principales

Base URL: `/api`

| Recurso     | Rutas                                                                 |
|-------------|-------------------------------------------------------------------------|
| Auth        | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`               |
| Usuarios    | `GET /users`, `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id` |
| Proveedores | `GET /suppliers`, `GET /suppliers/:id`, `POST /suppliers`, `PUT /suppliers/:id`, `DELETE /suppliers/:id` |
| Productos   | `GET /products`, `GET /products/:id`, `POST /products` 🔒, `PUT /products/:id` 🔒, `DELETE /products/:id` 🔒 |
| Movimientos | `GET /movements`, `GET /movements/:id`, `GET /movements/product/:productId`, `POST /movements` |
| Health      | `GET /health`                                                          |

🔒 Requiere autenticación (cookie JWT).

## Despliegue

El frontend está desplegado en Vercel (`frontend/vercel.json` define el `outputDirectory` y el rewrite para el enrutamiento SPA de Angular).

## Licencia

Uso privado / educativo.
