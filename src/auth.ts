import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

function idsAdminPermitidos(): Set<string> {
  const raw = process.env.ADMIN_DISCORD_IDS ?? "";
  return new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Discord],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.id) return false;
      return idsAdminPermitidos().has(profile.id as string);
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
