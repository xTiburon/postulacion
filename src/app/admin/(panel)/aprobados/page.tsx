import { prisma } from "@/lib/prisma";
import { ListaAprobados } from "./ListaAprobados";

export const metadata = { title: "Aprobados — Admin PlanetMC" };
export const dynamic = "force-dynamic";

export default async function AprobadosPage() {
  const aprobados = await prisma.postulacion.findMany({
    where: { estado: "APROBADO" },
    orderBy: { actualizadoEn: "desc" },
    select: { id: true, minecraftUsuario: true, discordUsuario: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Aprobados</h1>
      <p className="mt-1 text-sm text-muted">
        Lista lista para copiar y anunciar a los nuevos integrantes del Staff en Discord.
      </p>

      <div className="mt-8">
        <ListaAprobados aprobados={aprobados} />
      </div>
    </div>
  );
}
