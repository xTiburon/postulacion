import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TODAS_LAS_PREGUNTAS } from "@/lib/preguntas";
import { cambiarEstado, guardarNotas } from "../actions";
import type { Estado } from "@prisma/client";

export const dynamic = "force-dynamic";

const ESTADOS: { value: Estado; label: string; classes: string }[] = [
  { value: "REVISAR", label: "Revisar", classes: "border-warning/40 text-warning hover:bg-warning/10" },
  { value: "APROBADO", label: "Aprobar", classes: "border-success/40 text-success hover:bg-success/10" },
  { value: "RECHAZADO", label: "Rechazar", classes: "border-danger/40 text-danger hover:bg-danger/10" },
];

export default async function DetallePostulacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postulacion = await prisma.postulacion.findUnique({ where: { id } });
  if (!postulacion) notFound();

  const respuestas = postulacion.respuestas as Record<string, string | boolean>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/postulaciones" className="text-sm text-muted hover:text-accent-2">
        ← Volver a postulaciones
      </Link>

      <div className="glass-panel mt-4 rounded-2xl px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold">{postulacion.minecraftUsuario}</h1>
            <p className="mt-1 text-sm text-muted">
              {postulacion.discordUsuario} · {postulacion.email} · {postulacion.edad} años
            </p>
            <p className="mt-1 text-xs text-muted">
              Enviada el{" "}
              {new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeStyle: "short" }).format(
                postulacion.creadoEn
              )}
            </p>
          </div>

          <form action={cambiarEstado} className="flex gap-2">
            <input type="hidden" name="id" value={postulacion.id} />
            {ESTADOS.map((e) => (
              <button
                key={e.value}
                type="submit"
                name="estado"
                value={e.value}
                disabled={postulacion.estado === e.value}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${e.classes}`}
              >
                {e.label}
              </button>
            ))}
          </form>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {TODAS_LAS_PREGUNTAS.map((p) => {
          const valor = respuestas?.[p.key];
          if (valor === undefined || valor === "") return null;
          return (
            <div key={p.key} className="glass-panel rounded-xl px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-accent-2">{p.label}</p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-text">
                {typeof valor === "boolean" ? (valor ? "Sí, confirmado." : "No confirmado.") : valor}
              </p>
            </div>
          );
        })}
      </div>

      <div className="glass-panel mt-6 rounded-2xl px-6 py-6 sm:px-8">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-2">
          Notas internas del staff
        </h2>
        <form action={guardarNotas} className="mt-4">
          <input type="hidden" name="id" value={postulacion.id} />
          <textarea
            name="notas"
            rows={4}
            defaultValue={postulacion.notasAdmin ?? ""}
            placeholder="Notas visibles solo para el equipo administrador..."
            className="w-full rounded-lg border border-panel-border bg-void/60 px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="mt-3 rounded-full bg-panel border border-panel-border px-5 py-2 text-xs font-semibold text-text transition hover:border-accent"
          >
            Guardar notas
          </button>
        </form>
      </div>
    </div>
  );
}
