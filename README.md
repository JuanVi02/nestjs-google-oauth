# Trabajo Práctico - NestJS + Google OAuth2 + JWT

Backend desarrollado con NestJS para implementar autenticación mediante Google OAuth2, persistencia de usuarios con Prisma ORM y generación de JWT para proteger rutas privadas.

## Tecnologías

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport
- Google OAuth2
- JWT
- @nestjs/config

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/JuanVi02/nestjs-google-oauth
cd nestjs-google-oauth
```

Instalar dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` a partir de `.env.example`:

```env
DATABASE_URL="postgres://usuario:password@localhost:puerto/database"
JWT_SECRET="your_jwt_secret"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/redirect"
```

Las credenciales reales no deben subirse al repositorio.

## Google OAuth2

En Google Cloud Console crear un cliente OAuth de tipo **Web Application** y configurar:

**Authorized JavaScript origins**

```text
http://localhost:3000
```

**Authorized redirect URIs**

```text
http://localhost:3000/auth/google/redirect
```

## Base de datos

Validar el schema:

```bash
npx prisma validate
```

Aplicar migraciones:

```bash
npx prisma migrate dev --name init
```

Generar Prisma Client:

```bash
npx prisma generate
```

Si se utiliza Prisma Postgres local:

```bash
npx prisma dev
```

## Ejecutar el proyecto

```bash
npm run start:dev
```

Servidor:

```text
http://localhost:3000
```

## Endpoints

### Login con Google

```http
GET /auth/google
```

Inicia el flujo de autenticación con Google.

### Callback de Google

```http
GET /auth/google/redirect
```

Procesa el perfil de Google, busca o crea el usuario y genera un JWT.

### Ruta protegida

```http
GET /auth/profile
```

Requiere:

```http
Authorization: Bearer TOKEN
```

Sin token válido responde `401 Unauthorized`.

## Flujo de autenticación

```text
Usuario
  ↓
GET /auth/google
  ↓
Google OAuth2
  ↓
GET /auth/google/redirect
  ↓
GoogleStrategy
  ↓
AuthService
  ↓
UsersService
  ↓
Prisma + PostgreSQL
  ↓
JWT
  ↓
Rutas privadas
```

## Seguridad

Las credenciales sensibles se almacenan en variables de entorno.

El archivo `.env` debe permanecer fuera del repositorio mediante `.gitignore`.
