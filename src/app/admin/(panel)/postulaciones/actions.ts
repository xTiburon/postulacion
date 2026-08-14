"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CambiarEstadoSchema } from "@/lib/validacion";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("No autorizado.");
}

export async function cambiarEstado(formData: FormData) {
  await requireAdmin();

  const parsed = CambiarEstadoSchema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) throw new Error("Datos inválidos.");

  await prisma.postulacion.update({
    where: { id: parsed.data.id },
    data: { estado: parsed.data.estado },
  });

  revalidatePath("/admin/postulaciones");
  revalidatePath(`/admin/postulaciones/${parsed.data.id}`);
  revalidatePath("/admin/aprobados");
  revalidatePath("/admin");
}

export async function guardarNotas(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const notas = formData.get("notas");
  if (typeof id !== "string" || typeof notas !== "string") throw new Error("Datos inválidos.");

  await prisma.postulacion.update({
    where: { id },
    data: { notasAdmin: notas },
  });

  revalidatePath(`/admin/postulaciones/${id}`);
}
