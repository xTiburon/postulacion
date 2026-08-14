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
  if (!guildId || rolesAdmin.size === 0) return false;

  const res = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return false;

  const member = (await res.json()) as { roles?: string[] };
  return (member.roles ?? []).some((rolId) => rolesAdmin.has(rolId));
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
      if (!profile?.id) return false;

      if (listaDesdeEnv("ADMIN_DISCORD_IDS").has(profile.id as string)) return true;

      if (account?.access_token) {
        return tieneRolDeAdmin(account.access_token);
      }

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
