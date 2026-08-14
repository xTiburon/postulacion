import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { AccionRegistro, Prisma } from "@prisma/client";

export const metadata = { title: "Registro de actividad — Admin PlanetMC" };
export const dynamic = "force-dynamic";

const ACCIONES: { value: AccionRegistro | ""; label: string }[] = [
  { value: "", label: "Todas las acciones" },
  { value: "APROBADA", label: "Aprobadas" },
  { value: "RECHAZADA", label: "Rechazadas" },
  { value: "ELIMINADA", label: "Eliminadas" },
];

const accionEstilo: Record<AccionRegistro, string> = {
  APROBADA: "bg-success/15 text-success border-success/30",
  RECHAZADA: "bg-danger/15 text-danger border-danger/30",
  ELIMINADA: "bg-muted/15 text-muted border-panel-border",
};

const accionLabel: Record<AccionRegistro, string> = {
  APROBADA: "Aprobó",
  RECHAZADA: "Rechazó",
  ELIMINADA: "Eliminó",
};

const POR_PAGINA = 30;

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ accion?: string; pagina?: string }>;
}) {
  const sp = await searchParams;
  const accion = sp.accion ?? "";
  const pagina = Math.max(1, Number(sp.pagina) || 1);

  const where: Prisma.RegistroAdminWhereInput = accion ? { accion: accion as AccionRegistro } : {};

  const total = await prisma.registroAdmin.count({ where });
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);

  const registros = await prisma.registroAdmin.findMany({
    where,
    orderBy: { creadoEn: "desc" },
    skip: (paginaActual - 1) * POR_PAGINA,
    take: POR_PAGINA,
  });

  function href(overrides: Record<string, string | number>) {
    const params = new URLSearchParams();
    if (accion) params.set("accion", accion);
    params.set("pagina", String(paginaActual));
    for (const [k, v] of Object.entries(overrides)) {
      if (v === "") params.delete(k);
      else params.set(k, String(v));
    }
    return `/admin/registro?${params.toString()}`;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Registro de actividad</h1>
      <p className="mt-1 text-sm text-muted">
        Quién aprobó, rechazó o eliminó cada postulación — para mantener el proceso controlado.
      </p>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <select
          name="accion"
          defaultValue={accion}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-text outline-none transition focus:border-accent focus:bg-white/[0.05]"
        >
          {ACCIONES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
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
        {total} {total === 1 ? "registro" : "registros"} en total
      </p>

      <div className="glass-panel mt-3 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-panel-border text-xs uppercase tracking-wide text-muted">
              <th className="px-5 py-3 font-medium">Admin</th>
              <th className="px-5 py-3 font-medium">Acción</th>
              <th className="px-5 py-3 font-medium">Postulante</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id} className="border-b border-panel-border/60 last:border-0">
                <td className="px-5 py-3 font-medium text-text">{r.adminNombre}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${accionEstilo[r.accion]}`}>
                    {accionLabel[r.accion]}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {r.postulacionId ? (
                    <Link href={`/admin/postulaciones/${r.postulacionId}`} className="text-text hover:text-accent-2">
                      {r.postulanteMinecraft}
                    </Link>
                  ) : (
                    <span className="text-text">{r.postulanteMinecraft}</span>
                  )}
                  <span className="ml-2 text-muted">{r.postulanteEmail}</span>
                </td>
                <td className="px-5 py-3 text-muted">
                  {new Intl.DateTimeFormat("es-CL", { dateStyle: "short", timeStyle: "short" }).format(r.creadoEn)}
                </td>
              </tr>
            ))}
            {registros.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted">
                  Todavía no hay actividad registrada.
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
