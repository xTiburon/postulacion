-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('REVISAR', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "Postulacion" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "minecraftUsuario" TEXT NOT NULL,
    "discordUsuario" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'REVISAR',
    "respuestas" JSONB NOT NULL,
    "notasAdmin" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Postulacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Postulacion_email_key" ON "Postulacion"("email");

-- CreateIndex
CREATE INDEX "Postulacion_estado_idx" ON "Postulacion"("estado");

-- CreateIndex
CREATE INDEX "Postulacion_creadoEn_idx" ON "Postulacion"("creadoEn");
