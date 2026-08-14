import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PostulacionSchema } from "@/lib/validacion";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ errores: ["Solicitud inválida."] }, { status: 400 });
  }

  const parsed = PostulacionSchema.safeParse(body);
  if (!parsed.success) {
    const errores = parsed.error.issues.map((issue) => issue.message);
    return NextResponse.json({ errores }, { status: 400 });
  }

  const { email, minecraftUsuario, discordUsuario, edad, respuestas } = parsed.data;

  const existente = await prisma.postulacion.findUnique({ where: { email } });
  if (existente) {
    return NextResponse.json(
      { errores: ["Ya existe una postulación registrada con este correo electrónico."] },
      { status: 409 }
    );
  }

  try {
    await prisma.postulacion.create({
      data: {
        email,
        minecraftUsuario,
        discordUsuario,
        edad,
        respuestas: respuestas as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { errores: ["Ya existe una postulación registrada con este correo electrónico."] },
        { status: 409 }
      );
    }
    console.error("Error al crear postulación:", error);
    return NextResponse.json({ errores: ["Ocurrió un error inesperado. Intenta nuevamente."] }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
