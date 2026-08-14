import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PostulacionForm } from "./PostulacionForm";

export const metadata = {
  title: "Postular a Staff — PlanetMC",
};

export default function PostularPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="font-display text-sm font-bold tracking-[0.2em] text-muted uppercase">
            PlanetMC
          </span>
        </Link>
      </header>

      <main className="flex-1 px-6 pb-20 sm:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-glow text-3xl font-semibold tracking-tight sm:text-4xl">
            Postulación de Staff
          </h1>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Responde con sinceridad y el mayor detalle posible. Todos los campos son obligatorios.
          </p>
        </div>

        <PostulacionForm />
      </main>
    </div>
  );
}
