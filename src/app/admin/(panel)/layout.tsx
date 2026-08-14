import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Logo } from "@/components/Logo";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-panel-border px-6 py-4 sm:px-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-display text-xs font-bold tracking-[0.2em] text-muted uppercase">
              PlanetMC
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink href="/admin/postulaciones">Postulaciones</NavLink>
            <NavLink href="/admin/aprobados">Aprobados</NavLink>
            <NavLink href="/admin/registro">Registro</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">{session?.user?.name}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-full border border-panel-border px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-danger hover:text-danger"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3.5 py-1.5 text-muted transition hover:bg-panel hover:text-text"
    >
      {children}
    </Link>
  );
}
