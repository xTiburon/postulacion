import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Respaldo completo y "en crudo" de toda la base de datos: cada
// postulación con TODAS sus respuestas originales (sin filtrar por las
// preguntas actuales del formulario) más el registro de auditoría.
// Pensado como red de seguridad adicional, independiente de cualquier
// cambio futuro al formulario o al esquema visible del panel.
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const [postulaciones, registro] = await Promise.all([
    prisma.postulacion.findMany({ orderBy: { creadoEn: "asc" } }),
    prisma.registroAdmin.findMany({ orderBy: { creadoEn: "asc" } }),
  ]);

  const respaldo = {
    generadoEl: new Date().toISOString(),
    totalPostulaciones: postulaciones.length,
    totalRegistros: registro.length,
    postulaciones,
    registroAdmin: registro,
  };

  return new NextResponse(JSON.stringify(respaldo, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="respaldo-completo-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
