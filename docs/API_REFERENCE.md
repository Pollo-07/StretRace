# API Reference y Flujos Internos (Formato Unificado)

Base URL: `http://localhost:3000/api`

## Plantilla usada en todos los endpoints
- Método y ruta
- Auth
- Input (params/query/body)
- Request ejemplo
- Response ejemplo
- Códigos HTTP
- Flow hexagonal

## Root y Auth

### 1) GET /
- Auth: No
- Input: N/A
- Request ejemplo: N/A
- Response ejemplo:
```json
"Bienvenidos al Street race"
```
- Códigos HTTP: `200`
- Flow: `Client -> AppRouter`

### 2) POST /register
- Auth: No
- Input (body): `username,email,password_hash,categoria_id` + datos de zona/foto
- Request ejemplo:
```json
{
  "username": "jose",
  "email": "test@gmail.com",
  "password_hash": "123456",
  "foto_perfil": "https://img",
  "zona_localidad": "Centro",
  "zona_ciudad": "Bogota",
  "zona_estado": "Cundinamarca",
  "zona_pais": "Colombia",
  "categoria_id": "uuid"
}
```
- Response ejemplo:
```json
{ "ok": true, "result": { "id": "uuid", "username": "jose", "email": "test@gmail.com", "role": "piloto" } }
```
- Códigos HTTP: `201`, `500`
- Flow: `Client -> userControllers.RegisterUsers -> userServices.createUser -> IUserRepository.createUser -> userRepositorySql -> DB`

### 3) POST /auth/login
- Auth: No
- Input (body): `email,password`
- Request ejemplo:
```json
{ "email": "test@gmail.com", "password": "123456" }
```
- Response ejemplo:
```json
{
  "message": "login exitoso",
  "accessToken": "jwt_access",
  "user": { "id": "uuid", "username": "jose", "email": "test@gmail.com", "role": "piloto" }
}
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authController.login -> loginServices.login -> IUserRepository.findByEmail -> userRepositorySql -> DB -> token.generateToken/refreshToken`

### 4) POST /auth/logout
- Auth: No
- Input: N/A
- Request ejemplo: N/A
- Response ejemplo:
```json
{ "message": "Logged out" }
```
- Códigos HTTP: `200`
- Flow: `Client -> authController.logout -> clear refreshToken cookie`

### 5) POST /auth/refreshTokens
- Auth: Cookie refreshToken
- Input: cookie `refreshToken`
- Request ejemplo: N/A
- Response ejemplo:
```json
{ "id": "uuid", "role": "piloto", "accessToken": "jwt_access_new" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authController.refreshTokens -> loginServices.refreshTokens -> jwt.verify -> token.generateToken`

## Users (/user)

### 6) GET /user/me
- Auth: Bearer JWT
- Input: N/A (`req.user.userId`)
- Request ejemplo: header Authorization
- Response ejemplo:
```json
{ "message": "usuario extraido", "result": { "id": "uuid", "username": "jose" } }
```
- Códigos HTTP: `200`, `401`, `404`, `500`
- Flow: `Client -> authMiddleware -> userControllers.getUser -> userServices.getUser -> IUserRepository.getUser -> DB`

### 7) DELETE /user/deleteUser/:id
- Auth: Bearer JWT
- Input (params): `id`
- Request ejemplo: `/user/deleteUser/uuid`
- Response ejemplo:
```json
{ "message": "usuario eliminado" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> userControllers.deleteUser -> userServices.deleteUser -> IUserRepository.deleteUser -> DB`

### 8) PATCH /user/updateMe
- Auth: Bearer JWT
- Input (multipart): `foto_perfil` + campos usuario
- Request ejemplo: `multipart/form-data`
- Response ejemplo:
```json
{ "message": "usuario actulizado", "updateUser": { "id": "uuid" } }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> multer -> userControllers.updateMe -> userServices.updateUser -> Cloudinary -> IUserRepository.updateUser -> DB`

### 9) GET /user/discoverPilot
- Auth: Bearer JWT
- Input: N/A
- Request ejemplo: header Authorization
- Response ejemplo:
```json
{ "result": [{ "pilot_id": "uuid", "username": "pilot" }] }
```
- Códigos HTTP: `200`, `401`, `404`, `500`
- Flow: `Client -> authMiddleware -> userControllers.discoverPilot -> userServices.discoverPilot -> IUserRepository.getUser/discoverPilot -> DB`

### 10) POST /user/respectPilot
- Auth: Bearer JWT
- Input (body): `respectUserId`
- Request ejemplo:
```json
{ "respectUserId": "uuid" }
```
- Response ejemplo:
```json
{ "result": "respect" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> userControllers.respectPilot -> userServices.respectPilot -> IUserRepository.respectPilot -> DB`

### 11) GET /user/getRespectPilot
- Auth: Bearer JWT
- Input: N/A
- Request ejemplo: header Authorization
- Response ejemplo:
```json
{ "result": [{ "username": "pilot", "rango": "C" }] }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> userControllers.getRespectPilot -> userServices.getrespectPilot -> IUserRepository.getRespectPilot -> DB`

### 12) GET /user/UserAll
- Auth: Bearer JWT + admin
- Input: N/A
- Request ejemplo: header Authorization admin
- Response ejemplo:
```json
{ "result": [{ "id": "uuid", "username": "jose" }] }
```
- Códigos HTTP: `200`, `401`, `403`, `500`
- Flow: `Client -> authMiddleware -> adminMiddleware -> userControllers.UserAll -> userServices.getUserAll -> IUserRepository.UserAll -> DB`

### 13) GET /user/UserAllSearch
- Auth: Bearer JWT + admin
- Input (query): `page,limit,search`
- Request ejemplo: `/user/UserAllSearch?page=1&limit=10&search=jo`
- Response ejemplo:
```json
{ "result": { "data": [{ "id": "uuid" }], "totalUser": 100 } }
```
- Códigos HTTP: `200`, `401`, `403`, `500`
- Flow: `Client -> authMiddleware -> adminMiddleware -> userControllers.UserAllSearch -> userServices.getUserAllSearch -> IUserRepository.UserAllSearch -> DB`

### 14) PATCH /user/updateUser
- Auth: Bearer JWT + admin
- Input (body): `{ data, id }`
- Request ejemplo:
```json
{ "id": "uuid", "data": { "rango": "B" } }
```
- Response ejemplo:
```json
{ "message": "usuario actulizado", "updateUser": { "id": "uuid" } }
```
- Códigos HTTP: `200`, `401`, `403`, `500`
- Flow: `Client -> authMiddleware -> adminMiddleware -> userControllers.updateUser -> userServices.updateUser -> IUserRepository.updateUser -> DB`

## Vehicles (/vehicles)

### 15) POST /vehicles/createVehicle
- Auth: Bearer JWT
- Input (multipart): `foto` + datos vehículo
- Request ejemplo:
```json
{ "user_id": "uuid", "tipo_vehiculo": "carro", "marca": "Mazda", "modelo": "3", "anio": 2022, "color": "rojo", "placa": "ABC123", "modificaciones": "stock" }
```
- Response ejemplo:
```json
{ "ok": true, "result": { "id": 1, "marca": "Mazda", "activo": false } }
```
- Códigos HTTP: `201`, `400`, `401`, `500`
- Flow: `Client -> authMiddleware -> multer -> vehicleControllers.createVehicle -> vehicleServices.createVehicle -> Cloudinary -> IVehicleRepository.createVehicle -> DB`

### 16) GET /vehicles/vehicle
- Auth: Bearer JWT
- Input: N/A
- Request ejemplo: header Authorization
- Response ejemplo:
```json
{ "ok": true, "result": { "id": 1, "marca": "Mazda" } }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> vehicleControllers.getVehicle -> vehicleServices.getVehicle -> IVehicleRepository.getVehicle -> DB`

### 17) GET /vehicles/allVehicles
- Auth: Bearer JWT
- Input: N/A
- Request ejemplo: header Authorization
- Response ejemplo:
```json
{ "ok": true, "result": [{ "id": 1 }, { "id": 2 }] }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> vehicleControllers.allVehicle -> vehicleServices.allVehicle -> IVehicleRepository.allVehicle -> DB`

### 18) DELETE /vehicles/deleteVehicle/:id
- Auth: Bearer JWT
- Input (params): `id`
- Response ejemplo:
```json
{ "ok": true, "message": "vehiculo eliminado" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> vehicleControllers.deleteVehicle -> vehicleServices.deleteVehicle -> IVehicleRepository.deleteVehicle -> DB`

### 19) PATCH /vehicles/updateVehicle
- Auth: Bearer JWT
- Input (body): campos parciales de vehículo + `id`
- Response ejemplo:
```json
{ "ok": true, "result": { "id": 1, "color": "negro" } }
```
- Códigos HTTP: `200`, `400`, `401`, `500`
- Flow: `Client -> authMiddleware -> vehicleControllers.updateVehicle -> vehicleServices.updateVehicle -> IVehicleRepository.updateVehicle -> DB`

### 20) PATCH /vehicles/activeVehicle/:id
- Auth: Bearer JWT
- Input (params): `id`
- Response ejemplo:
```json
{ "ok": true }
```
- Códigos HTTP: `200`, `400`, `401`, `500`
- Flow: `Client -> authMiddleware -> vehicleControllers.activeVehicle -> vehicleServices.activeVehicle -> IVehicleRepository.activeVehicle -> DB`

## Categories (/category)

### 21) GET /category/category
- Auth: Bearer JWT
- Input (body actual): `id`
- Request ejemplo:
```json
{ "id": "uuid" }
```
- Response ejemplo:
```json
{ "ok": true, "result": { "id": "uuid", "nombre": "A" } }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> categoryController.getcategory -> categoryServices.getCategory -> ICategoryRepository.getCategory -> DB`

### 22) POST /category/createCategory
- Auth: Bearer JWT
- Input (body): `nombre,descripcion,activo`
- Response ejemplo:
```json
{ "ok": true, "responseChallenge": { "id": "uuid", "nombre": "A" } }
```
- Códigos HTTP: `201`, `401`, `500`
- Flow: `Client -> authMiddleware -> categoryController.createcategory -> categoryServices.createCategory -> ICategoryRepository.createCategory -> DB`

### 23) DELETE /category/deleteCategory
- Auth: Bearer JWT
- Input (body): `id`
- Response ejemplo:
```json
{ "ok": true, "message": "Categoría eliminada exitosamente" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> categoryController.deletecategory -> categoryServices.deleteCategory -> ICategoryRepository.deleteCategory -> DB`

### 24) PATCH /category/updateCategory
- Auth: Bearer JWT
- Input (body): `id` + campos parciales
- Response ejemplo:
```json
{ "ok": true, "result": { "id": "uuid", "activo": true } }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> categoryController.updatecategory -> categoryServices.updateCategory -> ICategoryRepository.updateCategory -> DB`

## Challenges (/challenges)

### 25) GET /challenges/challenge
- Auth: Bearer JWT
- Input: N/A
- Response ejemplo:
```json
{ "ok": true, "result": { "id": "challenge_uuid", "estado": "pendiente" } }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.getchallenge -> challengeServices.getchallenge -> IChallengeRepository.getchallenge -> DB`

### 26) GET /challenges/challengeAll
- Auth: Bearer JWT
- Input: N/A
- Response ejemplo:
```json
{ "ok": true, "result": [{ "challenge": { "id": "challenge_uuid", "estado": "aceptado" }, "retador": { "id": "u1" }, "retado": { "id": "u2" } }] }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.challengeAll -> challengeServices.challengeAll -> IChallengeRepository.challengeAll -> DB -> challengeAllMapper`

### 27) POST /challenges/createChallenge
- Auth: Bearer JWT
- Input (body): `challenge` + `notification`
- Request ejemplo:
```json
{
  "challenge": {
    "retador_id": "uuid_a",
    "retado_id": "uuid_b",
    "tipo_carrera": "cuarto_milla",
    "vehiculo_retador_id": "veh_a",
    "vehiculo_retado_id": "veh_b",
    "ubicacion_acordada": "Autodromo X",
    "fecha_acordada": "2026-05-10T15:00:00.000Z",
    "notas": "sin apuestas"
  },
  "notification": {
    "user_id": "uuid_b",
    "tipo": "reto_recibido",
    "leida": false,
    "referencia_id": "00000000-0000-0000-0000-000000000000"
  }
}
```
- Response ejemplo:
```json
{ "ok": true, "result": { "id": "challenge_uuid", "estado": "pendiente" } }
```
- Códigos HTTP: `201`, `400`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.createchallenge -> challengeServices.createchallenge -> IUserRepository + IVehicleRepository + IChallengeRepository + notificationServices -> DB + Socket.IO`

### 28) DELETE /challenges/deteleChallenge
- Auth: Bearer JWT
- Input (body): `id`
- Response ejemplo:
```json
{ "ok": true, "message": "challenge eliminado exitosamente" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.deletechallenge -> challengeServices.deletechallenge -> IChallengeRepository.deletechallenge -> DB`

### 29) PATCH /challenges/updateChallenge
- Auth: Bearer JWT
- Input (body): parcial de challenge
- Response ejemplo:
```json
{ "ok": true, "result": { "id": "challenge_uuid", "estado": "aceptado" } }
```
- Códigos HTTP: `200`, `400`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.updatechallenge -> challengeServices.updatechallenge -> IChallengeRepository.updatechallenge -> DB`

### 30) PATCH /challenges/acceptChallenge
- Auth: Bearer JWT
- Input (body): `id,id_retado,notification`
- Response ejemplo:
```json
{ "ok": true, "message": "challenge aceptado exitosamente" }
```
- Códigos HTTP: `200`, `400`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.acceptChallenge -> challengeServices.acceptChallenge -> IChallengeRepository.getchallenge/acceptChallenge + notificationServices.createNotification -> DB`

### 31) PATCH /challenges/rejectChallenge
- Auth: Bearer JWT
- Input (body): `id,id_retado,notification`
- Response ejemplo:
```json
{ "ok": true, "message": "challenge rechazado exitosamente" }
```
- Códigos HTTP: `200`, `400`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.rejectChallenge -> challengeServices.rejectChallenge -> IChallengeRepository.getchallenge/rejectChallenge + notificationServices -> DB`

### 32) PATCH /challenges/cancelChallenge
- Auth: Bearer JWT
- Input (body): `id`
- Response ejemplo:
```json
{ "ok": true, "message": "challenge cancelado exitosamente" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.cancelChallenge -> challengeServices.cancelChallenge -> IChallengeRepository.cancelChallenge -> DB`

### 33) PATCH /challenges/startChallenge
- Auth: Bearer JWT
- Input (body): `id`
- Response ejemplo:
```json
{ "ok": true, "message": "challenge iniciado exitosamente" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.startChallenge -> challengeServices.startChallenge -> IChallengeRepository.startChallenge -> DB`

### 34) PATCH /challenges/reporteChallenge
- Auth: Bearer JWT
- Input (body): `id,id_ganador,notas,notification[]`
- Request ejemplo:
```json
{ "id": "challenge_uuid", "id_ganador": "uuid_a", "notas": "ganó por 2 autos", "notification": [{ "user_id": "uuid_a", "tipo": "resultado", "leida": false }, { "user_id": "uuid_b", "tipo": "resultado", "leida": false }] }
```
- Response ejemplo:
```json
{ "ok": true, "message": "se ha registrado el reporte del challenge" }
```
- Códigos HTTP: `201`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.reporteChallenge -> challengeServices.reporteChallenge -> IChallengeRepository.reporte/getReporte -> complete|incomplete|disputa -> Ranking -> IUserRepository.updateUser -> DB`

### 35) GET /challenges/ChallengeDisputed
- Auth: Bearer JWT
- Input: N/A
- Response ejemplo:
```json
{ "result": [{ "challenge": { "estado": "disputa" } }] }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.ChallengeDisputed -> challengeServices.getChallengeDisputed -> IChallengeRepository.ChallengeDisputed -> DB`

### 36) POST /challenges/resolveChallengeDisputed
- Auth: Bearer JWT
- Input (body): `id,ganador_id`
- Response ejemplo:
```json
{ "ok": true, "message": "se ha resuelto el challenge con exito" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> challengeController.resolveChallengeDisputed -> challengeServices.resolveChallengeDisputed -> IChallengeRepository.resolveChallengeDisputed -> DB`

## Notifications (/notification)

### 37) GET /notification/
- Auth: Bearer JWT
- Input: N/A
- Response ejemplo:
```json
{ "ok": true, "result": [{ "id": "n1", "tipo": "reto_recibido", "leida": false }] }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> notificationController.getNotification -> notificationServices.getNotification -> INotificationRepository.getNotification -> DB`

### 38) DELETE /notification/deleteNotification
- Auth: Bearer JWT
- Input (body): `id`
- Response ejemplo:
```json
{ "ok": true, "result": "el usuario se elimino correctamente" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> notificationController.deleteNotification -> notificationServices.deleteNotification -> INotificationRepository.deleteNotification -> DB`

### 39) PATCH /notification/allNotificationsAsRead
- Auth: Bearer JWT
- Input: N/A
- Response ejemplo:
```json
{ "ok": true, "result": "se extrajo las Notificaciones correctamente" }
```
- Códigos HTTP: `200`, `401`, `500`
- Flow: `Client -> authMiddleware -> notificationController.AllNotificationsAsRead -> notificationServices.AllNotificationsAsRead -> INotificationRepository.AllNotificationsAsRead -> DB`

## Endpoints admin no montados (archivo existente)
`src/application/routes/admin-routes.ts` define rutas, pero no están montadas en `app-router.ts`.
