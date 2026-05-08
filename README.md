# StreetRace Backend API

Backend API para StreetRace construida con Express + TypeScript y organizada con enfoque de arquitectura hexagonal (Ports & Adapters).

## Descripción
Este servicio expone endpoints para autenticación, gestión de usuarios, vehículos, retos (challenges), categorías y notificaciones. Integra JWT (access + refresh token), subida de imágenes con Multer + Cloudinary, persistencia en SQL Server (`mssql`) y notificaciones en tiempo real con Socket.IO.

## Tecnologías
- Node.js
- Express 5
- TypeScript
- JWT (`jsonwebtoken`)
- SQL Server (`mssql`)
- Multer (memoria) + Cloudinary
- Socket.IO
- CORS
- Cookie Parser

## Estructura Hexagonal
- `src/application`: presentation (routes, controllers, middlewares)
- `src/domain`: reglas de negocio (services), modelos, DTOs y puertos
- `src/infrastructure`: adapters SQL, conexión DB, Cloudinary
- `src/utils`: utilidades transversales (token, ranking, tipos de notificación)

## Documentación detallada
- [Arquitectura Hexagonal](./docs/ARCHITECTURE.md)
- [Referencia API + Flujos](./docs/API_REFERENCE.md)
- [OpenAPI/Swagger](./docs/openapi.yaml)

## Instalación

```bash
npm install
```

## Variables de Entorno

Definir en `.env`:

```env
PORT=3000

# DB local
DB_HOST=localhost
DB_USER=...
DB_PASSWORD=...
DB_NAME=...

# DB Azure (si aplica)
DB_TYPE=mssql
DB_HOST_AZURE=...
DB_PORT_AZURE=1433
DB_USER_AZURE=...
DB_PASSWORD_AZURE=...
DB_NAME_AZURE=...

# JWT
JWT_SECRET=...
JWT_REFRESH_SECRET=...

# Cloudinary
CLOUD_NAME=...
API_KEY=...
API_SECRET=...
```

## Comandos

```bash
# desarrollo
npm run dev

# compilación TypeScript
npm run build
```

## Testing


## Autenticación

- Access token mediante:

```bash
Authorization: Bearer <token>
```

- Refresh token mediante cookie HTTP Only:

```bash
refreshToken
```

### Endpoints protegidos
- `/api/user`
- `/api/vehicles`
- `/api/challenges`
- `/api/category`
- `/api/notification`

Todos protegidos mediante `authMiddleware`.

---

# Endpoints Principales

Base URL:

```bash
http://localhost:3000/api
```

## Auth
- `POST /register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refreshTokens`

## Usuarios
- `GET /user/me`
- `PATCH /user/updateMe`

## Vehículos
- `POST /vehicles/createVehicle`
- `GET /vehicles/allVehicles`

## Challenges
- `POST /challenges/createChallenge`
- `PATCH /challenges/acceptChallenge`
- `PATCH /challenges/reporteChallenge`

## Notificaciones
- `GET /notification/`

---


## Referencia completa

Para ver request/response detallados y flujos internos:

- [API_REFERENCE.md](./docs/API_REFERENCE.md)

---