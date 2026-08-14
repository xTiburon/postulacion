import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Estado, Prisma } from "@prisma/client";
import { FilaPostulacion } from "./FilaPostulacion";

export const metadata = { title: "Postulaciones — Admin PlanetMC" };
export const dynamic = "force-dynamic";

const ESTADOS: { value: Estado | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "REVISAR", label: "Por revisar" },
  { value: "APROBADO", label: "Aprobadas" },
  { value: "RECHAZADO", label: "Rechazadas" },
];

const CAMPOS_ORDEN = {
  fecha: "creadoEn",
  edad: "edad",
  minecraft: "minecraftUsuario",
} as const;

type CampoOrden = keyof typeof CAMPOS_ORDEN;

const POR_PAGINA = 20;

export default async function PostulacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; sort?: string; dir?: string; pagina?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const estado = sp.estado ?? "";
  const sort: CampoOrden = sp.sort && sp.sort in CAMPOS_ORDEN ? (sp.sort as CampoOrden) : "fecha";
  const dir: "asc" | "desc" = sp.dir === "asc" ? "asc" : "desc";
  const pagina = Math.max(1, Number(sp.pagina) || 1);

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

  const total = await prisma.postulacion.count({ where });
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);

  const postulaciones = await prisma.postulacion.findMany({
    where,
    orderBy: { [CAMPOS_ORDEN[sort]]: dir },
    skip: (paginaActual - 1) * POR_PAGINA,
    take: POR_PAGINA,
    select: {
      id: true,
      email: true,
      minecraftUsuario: true,
      discordUsuario: true,
      edad: true,
      estado: true,
      creadoEn: true,
      notasAdmin: true,
    },
  });

  function href(overrides: Record<string, string | number>) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (estado) params.set("estado", estado);
    params.set("sort", sort);
    params.set("dir", dir);
    params.set("pagina", String(paginaActual));
    for (const [k, v] of Object.entries(overrides)) {
      if (v === "") params.delete(k);
      else params.set(k, String(v));
    }
    return `/admin/postulaciones?${params.toString()}`;
  }

  function encabezadoOrdenable(campo: CampoOrden, etiqueta: string) {
    const activo = sort === campo;
    const nuevaDir = activo && dir === "desc" ? "asc" : "desc";
    return (
      <Link
        href={href({ sort: campo, dir: nuevaDir, pagina: 1 })}
        className={`inline-flex items-center gap-1 hover:text-text ${activo ? "text-text" : ""}`}
      >
        {etiqueta}
        {activo && <span className="text-accent-2">{dir === "desc" ? "↓" : "↑"}</span>}
      </Link>
    );
  }

  const exportHref = `/api/admin/postulaciones/export?${new URLSearchParams({
    ...(q ? { q } : {}),
    ...(estado ? { estado } : {}),
  }).toString()}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Postulaciones</h1>
        <a
          href={exportHref}
          className="rounded-full border border-panel-border px-4 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-text"
        >
          ↓ Exportar CSV
        </a>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por correo, Minecraft o Discord..."
          className="min-w-[240px] flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-accent focus:bg-white/[0.05]"
        />
        <select
          name="estado"
          defaultValue={estado}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-text outline-none transition focus:border-accent focus:bg-white/[0.05]"
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

      <p className="mt-4 text-xs text-muted">
        {total} {total === 1 ? "postulación" : "postulaciones"} en total
      </p>

      <div className="glass-panel mt-3 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-panel-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">{encabezadoOrdenable("minecraft", "Minecraft")}</th>
              <th className="px-5 py-3 font-medium">Discord</th>
              <th className="px-5 py-3 font-medium">Correo</th>
              <th className="px-5 py-3 font-medium">{encabezadoOrdenable("edad", "Edad")}</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">{encabezadoOrdenable("fecha", "Fecha")}</th>
              <th className="px-5 py-3 font-medium text-right">Acciones rápidas</th>
            </tr>
          </thead>
          <tbody>
            {postulaciones.map((p) => (
              <FilaPostulacion key={p.id} p={{ ...p, tieneNotas: !!p.notasAdmin?.trim() }} />
            ))}
            {postulaciones.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted">
                  No hay postulaciones que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-muted">
          <Link
            href={href({ pagina: Math.max(1, paginaActual - 1) })}
            aria-disabled={paginaActual === 1}
            className={`rounded-full border border-panel-border px-3.5 py-1.5 transition hover:border-accent hover:text-text ${
              paginaActual === 1 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            ← Anterior
          </Link>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <Link
            href={href({ pagina: Math.min(totalPaginas, paginaActual + 1) })}
            aria-disabled={paginaActual === totalPaginas}
            className={`rounded-full border border-panel-border px-3.5 py-1.5 transition hover:border-accent hover:text-text ${
              paginaActual === totalPaginas ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Siguiente →
          </Link>
        </div>
      )}
    </div>
  );
}
