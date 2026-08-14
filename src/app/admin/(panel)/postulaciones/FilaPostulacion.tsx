"use client";

import { useRouter } from "next/navigation";
import type { Estado } from "@prisma/client";
import { cambiarEstado } from "./actions";

export const estadoEstilo: Record<Estado, string> = {
  REVISAR: "bg-warning/15 text-warning border-warning/30",
  APROBADO: "bg-success/15 text-success border-success/30",
  RECHAZADO: "bg-danger/15 text-danger border-danger/30",
};

const ACCIONES: { value: Estado; label: string; classes: string }[] = [
  { value: "REVISAR", label: "Revisar", classes: "hover:border-warning hover:text-warning" },
  { value: "APROBADO", label: "Aprobar", classes: "hover:border-success hover:text-success" },
  { value: "RECHAZADO", label: "Rechazar", classes: "hover:border-danger hover:text-danger" },
];

export type FilaData = {
  id: string;
  email: string;
  minecraftUsuario: string;
  discordUsuario: string;
  edad: number;
  estado: Estado;
  creadoEn: Date;
  tieneNotas: boolean;
};

export function FilaPostulacion({ p }: { p: FilaData }) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/admin/postulaciones/${p.id}`)}
      className="cursor-pointer border-b border-panel-border/60 transition last:border-0 hover:bg-white/[0.03]"
    >
      <td className="px-5 py-3">
        <span className="font-medium text-text">{p.minecraftUsuario}</span>
        {p.tieneNotas && (
          <span
            title="Tiene notas internas"
            className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent-2 align-middle"
          />
        )}
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
      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
        <form action={cambiarEstado} className="flex justify-end gap-1.5">
          <input type="hidden" name="id" value={p.id} />
          {ACCIONES.filter((a) => a.value !== p.estado).map((a) => (
            <button
              key={a.value}
              type="submit"
              name="estado"
              value={a.value}
              className={`rounded-full border border-panel-border px-2.5 py-1 text-[11px] font-medium text-muted transition ${a.classes}`}
            >
              {a.label}
            </button>
          ))}
        </form>
      </td>
    </tr>
  );
}
