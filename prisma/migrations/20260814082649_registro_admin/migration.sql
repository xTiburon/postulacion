-- CreateEnum
CREATE TYPE "AccionRegistro" AS ENUM ('APROBADA', 'RECHAZADA', 'ELIMINADA');

-- CreateTable
CREATE TABLE "RegistroAdmin" (
    "id" TEXT NOT NULL,
    "accion" "AccionRegistro" NOT NULL,
    "adminNombre" TEXT NOT NULL,
    "adminDiscordId" TEXT NOT NULL,
    "postulacionId" TEXT,
    "postulanteMinecraft" TEXT NOT NULL,
    "postulanteEmail" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistroAdmin_creadoEn_idx" ON "RegistroAdmin"("creadoEn");
