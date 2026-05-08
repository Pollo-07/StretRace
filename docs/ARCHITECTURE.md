# Arquitectura Hexagonal - StreetRace

## 1) Presentation Layer (`src/application`)
Responsable de HTTP y protocolo:

- `routes/*`: define endpoints Express
- `controllers/*`: traduce request/response y delega a servicios de dominio
- `middlewares/*`:
  - `authMiddleware`: valida JWT Bearer
  - `adminMiddleware`: exige `req.user.role === "admin"`
  - `multer`: carga archivos en memoria (`upload.single(...)`)

---

## 2) Application Layer
En este proyecto, la orquestación principal de casos de uso está implementada en `domain/services`.

Los controladores funcionan como una capa de aplicación ligera que recibe la request, valida datos básicos y delega la lógica de negocio al dominio.

---

## 3) Domain Layer (`src/domain`)
Reglas de negocio y contratos:

- `models/*`: entidades (`User`, `Vehicle`, `Challenge`, `Category`, `UserNotification`)
- `services/*`: casos de uso (login, usuario, retos, etc.)
- `ports/*`: interfaces de repositorio (contratos)
- `dto/*`: mapeo de salida para la API

### Ejemplos de reglas de negocio detectadas

- Un reto no puede ser entre pilotos de diferente rango o tipo de vehículo
- Un reto solo puede aceptarse/rechazarse si está en estado `pendiente`
- Un reto solo puede iniciarse en estado `aceptado`
- Un usuario puede activar un único vehículo a la vez

---

## 4) Infrastructure Layer (`src/infrastructure`)
Implementaciones concretas:

- `adapters/*RepositorySql.ts`: implementación de puertos con SQL Server
- `database/connection.ts`: conexión a base de datos
- `cloudinary/*`: subida de imágenes
- `config/*`: configuración externa

---

# Flujo General de Dependencias

La dirección de dependencia respeta arquitectura hexagonal:

```bash
application/controllers
→ domain/services
→ domain/ports
→ infrastructure/adapters
```

Los adapters implementan interfaces del dominio.

El dominio no depende de infraestructura.

---

# Flujo de una petición real

Ejemplo:

```bash
POST /api/challenges/createChallenge
```

Flujo interno:

```bash
Client
→ Challenge Route
→ Challenge Controller
→ Challenge Service
→ Challenge Port
→ Challenge Repository SQL
→ SQL Server
```

---

# Seguridad y Middlewares

- JWT access token con expiración corta (`10m`)
- Refresh token (`7d`)
- `authMiddleware` protege módulos de negocio
- `adminMiddleware` aplica autorización por rol
- Refresh token almacenado en cookie HTTP Only

---

# Validaciones y Restricciones Detectadas

- Formato Bearer obligatorio en `Authorization`
- Validaciones de estado en ciclo de vida de challenges
- Restricción de negocio de activación de vehículo (`único vehículo activo`)
- Reglas de consistencia de reportes de challenges para completar o disputar resultados

---
