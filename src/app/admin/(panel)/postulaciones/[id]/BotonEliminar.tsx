"use client";

import { eliminarPostulacion } from "../actions";

export function BotonEliminar({ id, minecraftUsuario }: { id: string; minecraftUsuario: string }) {
  return (
    <form
      action={eliminarPostulacion}
      onSubmit={(e) => {
        const confirmado = window.confirm(
          `¿Eliminar permanentemente la postulación de "${minecraftUsuario}"? Esta acción no se puede deshacer.`
        );
        if (!confirmado) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-panel-border px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-danger hover:text-danger"
      >
        Eliminar postulación
      </button>
    </form>
  );
}
