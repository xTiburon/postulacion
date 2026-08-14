import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

function listaDesdeEnv(nombre: string): Set<string> {
  const raw = process.env[nombre] ?? "";
  return new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
}

async function tieneRolDeAdmin(accessToken: string): Promise<boolean> {
  const guildId = process.env.ADMIN_DISCORD_GUILD_ID;
  const rolesAdmin = listaDesdeEnv("ADMIN_DISCORD_ROLE_IDS");
  console.log("[auth-debug] guildId configurado:", guildId, "roles admin configurados:", [...rolesAdmin]);
  if (!guildId || rolesAdmin.size === 0) {
    console.log("[auth-debug] falta ADMIN_DISCORD_GUILD_ID o ADMIN_DISCORD_ROLE_IDS en las env vars");
    return false;
  }

  const res = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const texto = await res.text();
    console.log("[auth-debug] fetch a Discord falló, status:", res.status, "body:", texto);
    return false;
  }

  const member = (await res.json()) as { roles?: string[] };
  console.log("[auth-debug] roles del usuario en el servidor:", member.roles);
  const tiene = (member.roles ?? []).some((rolId) => rolesAdmin.has(rolId));
  console.log("[auth-debug] ¿tiene rol de admin?:", tiene);
  return tiene;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      authorization: { params: { scope: "identify guilds.members.read" } },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ profile, account }) {
      console.log("[auth-debug] intento de login, discord id:", profile?.id, "scope otorgado:", account?.scope);
      if (!profile?.id) return false;

      if (listaDesdeEnv("ADMIN_DISCORD_IDS").has(profile.id as string)) {
        console.log("[auth-debug] autorizado por ADMIN_DISCORD_IDS");
        return true;
      }

      if (account?.access_token) {
        return tieneRolDeAdmin(account.access_token);
      }

      console.log("[auth-debug] no hay access_token en account, no se puede verificar el rol");
      return false;
    },
    async jwt({ token, profile }) {
      if (profile?.id) {
        token.discordId = profile.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.discordId) {
        (session.user as typeof session.user & { discordId?: string }).discordId =
          token.discordId as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
