# Guía de despliegue — Postulaciones Staff PlanetMC

Sistema construido con **Next.js + PostgreSQL (Prisma) + NextAuth (Discord OAuth)**, pensado para desplegarse gratis en **Vercel** con base de datos gratuita en **Neon**, sobre tu dominio `postulacion.planetmc.net`.

Tiempo estimado: 20-30 minutos, sin escribir código adicional.

---

## 0. Requisitos previos

- Una cuenta de GitHub (gratis).
- Una cuenta de [Vercel](https://vercel.com) (gratis, puedes entrar con GitHub).
- Una cuenta de [Neon](https://neon.tech) (gratis, base de datos PostgreSQL).
- Acceso al panel DNS de `planetmc.net` (para apuntar el subdominio).
- Acceso al [Discord Developer Portal](https://discord.com/developers/applications).

---

## 1. Crear la base de datos (Neon)

1. Ve a [neon.tech](https://neon.tech) y crea un proyecto nuevo, por ejemplo `postulaciones-planetmc`.
2. En el dashboard del proyecto, ve a **Connection Details**.
3. Copia dos cadenas de conexión:
   - **Pooled connection** (para uso normal de la app) → esta será tu `DATABASE_URL`.
   - **Direct connection** (sin pooling, para migraciones) → esta será tu `DIRECT_URL`.
   Ambas se ven muy parecidas, la diferencia suele ser que la pooled incluye `-pooler` en el host.

Guarda ambos valores, los necesitarás en el paso 4 y 6.

---

## 2. Crear la aplicación de Discord (para el login del panel admin)

1. Ve a [discord.com/developers/applications](https://discord.com/developers/applications) → **New Application**.
2. Ponle un nombre, ej: `PlanetMC Postulaciones`.
3. En el menú lateral, ve a **OAuth2**.
4. Copia el **Client ID** y el **Client Secret** (botón "Reset Secret" si no lo ves).
5. En la sección **Redirects**, agrega estas dos URLs:
   - `http://localhost:3000/api/auth/callback/discord` (para pruebas locales)
   - `https://postulacion.planetmc.net/api/auth/callback/discord` (para producción)
6. Guarda los cambios.

---

## 3. Obtener tu ID de Discord (para tener acceso al panel)

1. En Discord, ve a Ajustes → Avanzado → activa **Modo de desarrollador**.
2. Click derecho sobre tu propio perfil → **Copiar ID de usuario**.
3. Guarda ese número — es el que va en `ADMIN_DISCORD_IDS`. Puedes agregar varios administradores separando los IDs por coma.

---

## 4. Configurar el proyecto localmente

1. Copia `.env.example` a un nuevo archivo llamado `.env.local`.
2. Completa los valores:
   ```
   DATABASE_URL="<pooled connection de Neon>"
   DIRECT_URL="<direct connection de Neon>"
   AUTH_SECRET="<genera uno abajo>"
   AUTH_DISCORD_ID="<client id de discord>"
   AUTH_DISCORD_SECRET="<client secret de discord>"
   ADMIN_DISCORD_IDS="<tu id de discord>"
   ```
3. Genera `AUTH_SECRET` con:
   ```bash
   npx auth secret
   ```
   (esto además puede escribirlo directo en tu `.env.local`)

4. Instala dependencias y crea las tablas en la base de datos:
   ```bash
   npm install
   npm run db:migrate
   ```
   Esto crea la migración inicial y las tablas en Neon.

5. Prueba localmente:
   ```bash
   npm run dev
   ```
   Abre `http://localhost:3000`, postula de prueba, y entra a `/admin` con tu cuenta de Discord para ver el panel.

---

## 5. Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Sistema de postulaciones Staff PlanetMC"
```

Crea un repositorio nuevo en GitHub (puede ser privado) y sigue las instrucciones para conectarlo y hacer push.

> El archivo `.env.local` **no se sube** (ya está en `.gitignore`) — tus claves quedan seguras.

---

## 6. Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new) e importa el repositorio de GitHub.
2. En **Environment Variables**, agrega las mismas variables de tu `.env.local`:
   `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, `ADMIN_DISCORD_IDS`.
3. Click **Deploy**. En unos minutos tendrás una URL tipo `postulaciones-staff.vercel.app` funcionando.
4. Las tablas ya existen en Neon (las creaste en el paso 4), así que no necesitas hacer nada más con la base de datos.

---

## 7. Conectar tu dominio postulacion.planetmc.net

1. En el proyecto de Vercel, ve a **Settings → Domains** y agrega `postulacion.planetmc.net`.
2. Vercel te dará un registro DNS para agregar (normalmente un **CNAME** apuntando a `cname.vercel-dns.com`).
3. Entra al panel DNS donde administras `planetmc.net` y agrega ese registro para el subdominio `postulacion`.
4. Espera la propagación (minutos a un par de horas). Vercel emitirá un certificado HTTPS automáticamente.

---

## 8. Ajuste final

Una vez el dominio esté activo, confirma que en el Discord Developer Portal (paso 2) sigue registrada la redirect URL de producción:
`https://postulacion.planetmc.net/api/auth/callback/discord`.

Listo — `postulacion.planetmc.net` queda funcionando de forma gratuita (dentro de los límites gratuitos de Vercel y Neon, más que suficientes para este volumen de postulaciones).

---

## Mantenimiento

**Agregar/quitar administradores:** edita la variable `ADMIN_DISCORD_IDS` en Vercel (Settings → Environment Variables) y vuelve a desplegar.

**Agregar, quitar o modificar preguntas del formulario:** edita `src/lib/preguntas.ts` — es la única fuente de verdad, se usa automáticamente en el formulario, la validación y la vista de detalle del panel admin. No requiere migraciones porque las respuestas se guardan como JSON.

**Ver la base de datos directamente:** `npm run db:studio` abre una interfaz visual de Prisma sobre tu base de datos.

**Revisar postulaciones:** todo se hace desde `/admin` una vez autenticado con una cuenta de Discord autorizada.
