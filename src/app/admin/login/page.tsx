import Link from "next/link";
import { signIn } from "@/auth";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Ingresar — Admin PlanetMC",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Logo className="h-7 w-7" />
        <span className="font-display text-sm font-bold tracking-[0.2em] text-muted uppercase">
          PlanetMC
        </span>
      </Link>

      <div className="glass-panel w-full max-w-sm rounded-2xl px-8 py-10 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Panel de administración</h1>
        <p className="mt-2 text-sm text-muted">
          Inicia sesión con la cuenta de Discord autorizada para gestionar postulaciones.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
            Tu cuenta de Discord no tiene permisos de administrador.
          </p>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("discord", { redirectTo: callbackUrl ?? "/admin" });
          }}
        >
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-6 py-3 text-sm font-bold text-void transition hover:brightness-110"
          >
            Iniciar sesión con Discord
          </button>
        </form>
      </div>
    </div>
  );
}
