# Postulaciones Staff — PlanetMC

Sistema de postulaciones de Staff para PlanetMC: landing pública, formulario de postulación, base de datos PostgreSQL (Prisma) y panel de administración con login por Discord.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** vía **Prisma ORM** (pensado para [Neon](https://neon.tech), gratis)
- **NextAuth (Auth.js)** con Discord OAuth para el panel admin
- **Zod** para validación de datos

## Estructura relevante

- `src/lib/preguntas.ts` — única fuente de verdad de las preguntas del formulario (usada por el formulario, la validación y el panel admin).
- `src/app/page.tsx` — landing pública.
- `src/app/postular/` — formulario de postulación.
- `src/app/api/postulaciones/route.ts` — recibe y valida cada postulación, evita correos duplicados.
- `src/app/admin/` — panel de administración (protegido, requiere Discord autorizado vía `ADMIN_DISCORD_IDS`).
- `prisma/schema.prisma` — modelo de datos.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa las variables, ver DEPLOY.md
npm run db:migrate
npm run dev
```

## Despliegue

Ver [DEPLOY.md](./DEPLOY.md) para la guía paso a paso de despliegue gratuito en Vercel + Neon sobre `postulacion.planetmc.net`.
