import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Estado, Prisma } from "@prisma/client";

export const metadata = { title: "Postulaciones — Admin PlanetMC" };
export const dynamic = "force-dynamic";

const ESTADOS: { value: Estado | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "REVISAR", label: "Por revisar" },
  { value: "APROBADO", label: "Aprobadas" },
  { value: "RECHAZADO", label: "Rechazadas" },
];

const estadoEstilo: Record<Estado, string> = {
  REVISAR: "bg-warning/15 text-warning border-warning/30",
  APROBADO: "bg-success/15 text-success border-success/30",
  RECHAZADO: "bg-danger/15 text-danger border-danger/30",
};

export default async function PostulacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string }>;
}) {
  const { q = "", estado = "" } = await searchParams;

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
    select: {
      id: true,
      email: true,
      minecraftUsuario: true,
      discordUsuario: true,
      edad: true,
      estado: true,
      creadoEn: true,
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Postulaciones</h1>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por correo, Minecraft o Discord..."
          className="min-w-[240px] flex-1 rounded-lg border border-panel-border bg-void/60 px-4 py-2 text-sm text-text placeholder:text-muted/70 outline-none focus:border-accent"
        />
        <select
          name="estado"
          defaultValue={estado}
          className="rounded-lg border border-panel-border bg-void/60 px-4 py-2 text-sm text-text outline-none focus:border-accent"
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-accent to-accent-2 px-5 py-2 text-sm font-bold text-void transition hover:brightness-110"
        >
          Filtrar
        </button>
      </form>

      <div className="glass-panel mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-panel-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Minecraft</th>
              <th className="px-5 py-3 font-medium">Discord</th>
              <th className="px-5 py-3 font-medium">Correo</th>
              <th className="px-5 py-3 font-medium">Edad</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {postulaciones.map((p) => (
              <tr key={p.id} className="border-b border-panel-border/60 last:border-0 hover:bg-panel/60">
                <td className="px-5 py-3">
                  <Link href={`/admin/postulaciones/${p.id}`} className="font-medium text-text hover:text-accent-2">
                    {p.minecraftUsuario}
                  </Link>
                </td>
                <td className="px-5 py-3 text-muted">{p.discordUsuario}</td>
                <td className="px-5 py-3 text-muted">{p.email}</td>
                <td className="px-5 py-3 text-muted">{p.edad}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${estadoEstilo[p.estado]}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted">
                  {new Intl.DateTimeFormat("es-CL", { dateStyle: "short", timeStyle: "short" }).format(p.creadoEn)}
                </td>
              </tr>
            ))}
            {postulaciones.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  No hay postulaciones que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
