"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { SECCIONES } from "@/lib/preguntas";

const inputClass =
  "w-full rounded-lg border border-panel-border bg-void/60 px-4 py-2.5 text-sm text-text placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

type EstadoEnvio = "idle" | "enviando" | "exito" | "error";

export function PostulacionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [estado, setEstado] = useState<EstadoEnvio>("idle");
  const [errores, setErrores] = useState<string[]>([]);
  const [experienciaPrevia, setExperienciaPrevia] = useState("");
  const [sancionesPrevias, setSancionesPrevias] = useState("");

  const condicionValores: Record<string, string> = {
    experienciaPrevia,
    sancionesPrevias,
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;

    const form = formRef.current;
    if (!form.reportValidity()) return;

    const data = new FormData(form);

    const respuestas: Record<string, string | boolean> = {};
    for (const { preguntas } of SECCIONES) {
      for (const p of preguntas) {
        if (p.tipo === "checkbox") {
          respuestas[p.key] = data.get(p.key) === "on";
        } else {
          respuestas[p.key] = (data.get(p.key) as string) ?? "";
        }
      }
    }

    const payload = {
      email: data.get("email"),
      minecraftUsuario: data.get("minecraftUsuario"),
      discordUsuario: data.get("discordUsuario"),
      edad: data.get("edad"),
      respuestas,
    };

    setEstado("enviando");
    setErrores([]);

    try {
      const res = await fetch("/api/postulaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok) {
        setEstado("exito");
        return;
      }

      if (res.status === 409) {
        setErrores(["Ya existe una postulación registrada con este correo electrónico."]);
      } else if (json.errores) {
        setErrores(json.errores as string[]);
      } else {
        setErrores(["Ocurrió un error inesperado. Intenta nuevamente."]);
      }
      setEstado("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrores(["No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo."]);
      setEstado("error");
    }
  }

  if (estado === "exito") {
    return (
      <div className="glass-panel mx-auto max-w-lg rounded-2xl px-8 py-12 text-center">
        <h1 className="font-display text-2xl font-bold text-glow">¡Postulación enviada!</h1>
        <p className="mt-4 text-muted">
          Gracias por postular al Staff de PlanetMC. Tu postulación quedó registrada y será
          revisada por el equipo. Te contactaremos por Discord si avanzas en el proceso.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-2.5 text-sm font-bold text-void transition hover:brightness-110"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="mx-auto max-w-2xl">
      {errores.length > 0 && (
        <div className="mb-6 rounded-xl border border-danger/40 bg-danger/10 px-5 py-4 text-sm text-danger">
          <p className="font-semibold">Revisa lo siguiente antes de continuar:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errores.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <Seccion titulo="Datos básicos">
        <Campo label="Correo electrónico" htmlFor="email">
          <input id="email" name="email" type="email" required className={inputClass} placeholder="tucorreo@ejemplo.com" />
        </Campo>
        <Campo label="Usuario de Minecraft (IGN)" htmlFor="minecraftUsuario">
          <input
            id="minecraftUsuario"
            name="minecraftUsuario"
            type="text"
            required
            minLength={3}
            maxLength={16}
            pattern="[A-Za-z0-9_]{3,16}"
            title="3 a 16 caracteres: letras, números o guión bajo."
            className={inputClass}
          />
        </Campo>
        <Campo label="Usuario de Discord" htmlFor="discordUsuario">
          <input
            id="discordUsuario"
            name="discordUsuario"
            type="text"
            required
            pattern="@[a-zA-Z0-9._]{2,32}"
            title="Debe tener el formato @usuario"
            placeholder="@usuario"
            className={inputClass}
          />
        </Campo>
        <Campo label="Edad" htmlFor="edad">
          <input id="edad" name="edad" type="number" required min={1} max={120} className={inputClass} />
        </Campo>
      </Seccion>

      {SECCIONES.map((seccion) => (
        <Seccion key={seccion.titulo} titulo={seccion.titulo}>
          {seccion.preguntas.map((p) => {
            if (p.condicional) {
              const valorTrigger = condicionValores[p.condicional.dependsOn];
              if (valorTrigger !== p.condicional.showWhen) return null;
            }

            const onTriggerChange = (valor: string) => {
              if (p.key === "experienciaPrevia") setExperienciaPrevia(valor);
              if (p.key === "sancionesPrevias") setSancionesPrevias(valor);
            };

            if (p.tipo === "checkbox") {
              return (
                <label
                  key={p.key}
                  htmlFor={p.key}
                  className="flex items-start gap-3 rounded-lg border border-panel-border bg-void/40 px-4 py-3 text-sm text-text"
                >
                  <input
                    id={p.key}
                    name={p.key}
                    type="checkbox"
                    required={p.requerida}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-panel-border accent-accent"
                  />
                  <span>{p.label}</span>
                </label>
              );
            }

            return (
              <Campo key={p.key} label={p.label} htmlFor={p.key}>
                {p.tipo === "textarea" && (
                  <textarea id={p.key} name={p.key} required={p.requerida} rows={3} className={inputClass} />
                )}
                {p.tipo === "text" && (
                  <input
                    id={p.key}
                    name={p.key}
                    type="text"
                    required={p.requerida}
                    placeholder={p.placeholder}
                    className={inputClass}
                  />
                )}
                {p.tipo === "select" && (
                  <select
                    id={p.key}
                    name={p.key}
                    required={p.requerida}
                    className={inputClass}
                    onChange={(e) => onTriggerChange(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {p.opciones?.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                )}
              </Campo>
            );
          })}
        </Seccion>
      ))}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-4 w-full rounded-full bg-gradient-to-r from-accent to-accent-2 px-8 py-3.5 text-sm font-bold text-void shadow-[0_0_30px_-6px_var(--color-accent)] transition hover:brightness-110 disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando..." : "Enviar postulación"}
      </button>
    </form>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="glass-panel mb-8 rounded-2xl px-6 py-6 sm:px-8">
      <h2 className="font-display mb-5 text-xs font-bold uppercase tracking-[0.2em] text-accent-2">
        {titulo}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Campo({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
      {children}
    </div>
  );
}
