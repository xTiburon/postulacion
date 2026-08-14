import Link from "next/link";
import { Logo } from "@/components/Logo";
import { REQUISITOS } from "@/lib/preguntas";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="font-display text-sm font-bold tracking-[0.2em] text-muted uppercase">
            PlanetMC
          </span>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-panel-border px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-text"
        >
          Ingresar
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <Logo className="mb-8 h-20 w-20 sm:h-24 sm:w-24" />

        <h1 className="text-glow text-4xl font-semibold tracking-tight sm:text-6xl">
          Postulaciones de Staff
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
          Únete al equipo que mantiene PlanetMC en órbita. Completa una postulación honesta y
          detallada. La revisamos con calma y te contactamos por Discord.
        </p>

        <section className="glass-panel mt-10 w-full max-w-xl rounded-2xl px-6 py-6 text-left sm:px-8">
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent-2">
            Requisitos importantes
          </h2>
          <ul className="mt-4 space-y-3">
            {REQUISITOS.map((requisito) => (
              <li key={requisito} className="flex items-start gap-3 text-sm text-text sm:text-base">
                <span
                  className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2"
                  aria-hidden="true"
                />
                {requisito}
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/postular"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-8 py-3.5 text-sm font-bold text-void shadow-[0_0_30px_-6px_var(--color-accent)] transition hover:brightness-110 sm:text-base"
        >
          Empezar postulación
        </Link>
      </main>

      <footer className="px-6 pb-6 text-center text-xs text-muted sm:px-10">
        PlanetMC — Sistema de Postulaciones
      </footer>
    </div>
  );
}
