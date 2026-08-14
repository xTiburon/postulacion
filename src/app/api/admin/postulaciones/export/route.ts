import { NextRequest, NextResponse } from "next/server";
import type { Estado, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TODAS_LAS_PREGUNTAS } from "@/lib/preguntas";

function celdaCsv(valor: unknown): string {
  const texto = valor === null || valor === undefined ? "" : String(valor);
  if (/[",\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const estado = searchParams.get("estado") ?? "";

  const where: Prisma.PostulacionWhereInput = {
    ...(estado ? { estado: estado as Estado } : {}),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { minecraftUsuario: { contains: q, mode: "insensitive" } },
            { discordUsuario: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const postulaciones = await prisma.postulacion.findMany({
    where,
    orderBy: { creadoEn: "desc" },
  });

  const encabezados = [
    "Fecha",
    "Minecraft",
    "Discord",
    "Correo",
    "Edad",
    "Estado",
    "Notas internas",
    ...TODAS_LAS_PREGUNTAS.map((p) => p.label),
  ];

  const filas = postulaciones.map((p) => {
    const respuestas = p.respuestas as Record<string, string | boolean>;
    return [
      p.creadoEn.toISOString(),
      p.minecraftUsuario,
      p.discordUsuario,
      p.email,
      p.edad,
      p.estado,
      p.notasAdmin ?? "",
      ...TODAS_LAS_PREGUNTAS.map((preg) => {
        const valor = respuestas?.[preg.key];
        if (typeof valor === "boolean") return valor ? "Sí" : "No";
        return valor ?? "";
      }),
    ];
  });

  const csv = [encabezados, ...filas].map((fila) => fila.map(celdaCsv).join(",")).join("\r\n");
  const bom = "﻿"; // para que Excel abra bien los acentos

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="postulaciones-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
