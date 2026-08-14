"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CambiarEstadoSchema } from "@/lib/validacion";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");
  return session;
}

function revalidarTodo(id?: string) {
  revalidatePath("/admin/postulaciones");
  if (id) revalidatePath(`/admin/postulaciones/${id}`);
  revalidatePath("/admin/aprobados");
  revalidatePath("/admin");
  revalidatePath("/admin/registro");
}

export async function cambiarEstado(formData: FormData) {
  const session = await requireAdmin();

  const parsed = CambiarEstadoSchema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) throw new Error("Datos inválidos.");

  const postulacion = await prisma.postulacion.update({
    where: { id: parsed.data.id },
    data: { estado: parsed.data.estado },
  });

  if (parsed.data.estado === "APROBADO" || parsed.data.estado === "RECHAZADO") {
    await prisma.registroAdmin.create({
      data: {
        accion: parsed.data.estado === "APROBADO" ? "APROBADA" : "RECHAZADA",
        adminNombre: session.user?.name ?? "Admin desconocido",
        adminDiscordId: (session.user as { discordId?: string })?.discordId ?? "desconocido",
        postulacionId: postulacion.id,
        postulanteMinecraft: postulacion.minecraftUsuario,
        postulanteEmail: postulacion.email,
      },
    });
  }

  revalidarTodo(parsed.data.id);
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

export async function eliminarPostulacion(formData: FormData) {
  const session = await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Datos inválidos.");

  const postulacion = await prisma.postulacion.findUnique({ where: { id } });
  if (!postulacion) throw new Error("La postulación ya no existe.");

  await prisma.registroAdmin.create({
    data: {
      accion: "ELIMINADA",
      adminNombre: session.user?.name ?? "Admin desconocido",
      adminDiscordId: (session.user as { discordId?: string })?.discordId ?? "desconocido",
      postulacionId: null,
      postulanteMinecraft: postulacion.minecraftUsuario,
      postulanteEmail: postulacion.email,
    },
  });

  await prisma.postulacion.delete({ where: { id } });

  revalidarTodo();
  redirect("/admin/postulaciones");
}
