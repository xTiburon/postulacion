"use client";

import { useState } from "react";

type Aprobado = { id: string; minecraftUsuario: string; discordUsuario: string };

function formatoEntrada(a: Aprobado) {
  return `${a.minecraftUsuario} | ${a.discordUsuario}`;
}

export function ListaAprobados({ aprobados }: { aprobados: Aprobado[] }) {
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [copiadoTodo, setCopiadoTodo] = useState(false);

  async function copiar(texto: string, marcar: () => void) {
    await navigator.clipboard.writeText(texto);
    marcar();
    setTimeout(() => {
      setCopiadoId(null);
      setCopiadoTodo(false);
    }, 1800);
  }

  const textoCompleto = aprobados.map(formatoEntrada).join("\n");

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {aprobados.length} postulante{aprobados.length === 1 ? "" : "s"} aprobado
          {aprobados.length === 1 ? "" : "s"}.
        </p>
        {aprobados.length > 0 && (
          <button
            onClick={() => copiar(textoCompleto, () => setCopiadoTodo(true))}
            className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2 text-xs font-bold text-void transition hover:brightness-110"
          >
            {copiadoTodo ? "¡Copiado!" : "Copiar lista completa"}
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {aprobados.map((a) => (
          <div key={a.id} className="glass-panel flex items-center justify-between rounded-xl px-5 py-4">
            <pre className="whitespace-pre-wrap font-sans text-sm text-text">{formatoEntrada(a)}</pre>
            <button
              onClick={() => copiar(formatoEntrada(a), () => setCopiadoId(a.id))}
              className="ml-4 shrink-0 rounded-full border border-panel-border px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-accent hover:text-text"
            >
              {copiadoId === a.id ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        ))}
        {aprobados.length === 0 && (
          <p className="glass-panel rounded-xl px-5 py-8 text-center text-sm text-muted">
            Aún no hay postulaciones aprobadas.
          </p>
        )}
      </div>
    </div>
  );
}
