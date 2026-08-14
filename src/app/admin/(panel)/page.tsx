import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Panel — Admin PlanetMC" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [revisar, aprobado, rechazado, total] = await Promise.all([
    prisma.postulacion.count({ where: { estado: "REVISAR" } }),
    prisma.postulacion.count({ where: { estado: "APROBADO" } }),
    prisma.postulacion.count({ where: { estado: "RECHAZADO" } }),
    prisma.postulacion.count(),
  ]);

  const tarjetas = [
    { label: "Por revisar", valor: revisar, href: "/admin/postulaciones?estado=REVISAR", color: "text-warning" },
    { label: "Aprobadas", valor: aprobado, href: "/admin/postulaciones?estado=APROBADO", color: "text-success" },
    { label: "Rechazadas", valor: rechazado, href: "/admin/postulaciones?estado=RECHAZADO", color: "text-danger" },
    { label: "Total", valor: total, href: "/admin/postulaciones", color: "text-text" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Panel de postulaciones</h1>
      <p className="mt-1 text-sm text-muted">Resumen general del proceso de selección.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tarjetas.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="glass-panel rounded-2xl px-5 py-6 transition hover:border-accent"
          >
            <p className="text-xs uppercase tracking-wide text-muted">{t.label}</p>
            <p className={`mt-2 text-3xl font-semibold tracking-tight ${t.color}`}>{t.valor}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
