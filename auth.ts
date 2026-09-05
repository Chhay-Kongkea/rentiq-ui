
import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

type KeycloakRoleClaims = {
  role?: string;
  realm_access?: { roles?: string[] };
  resource_access?: Record<string, { roles?: string[] }>;
};

function getRoleFromAccessToken(accessToken?: string) {
  if (!accessToken) return undefined;

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return undefined;

    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as KeycloakRoleClaims;
    const roles = [
      claims.role,
      ...(claims.realm_access?.roles ?? []),
      ...Object.values(claims.resource_access ?? {}).flatMap(
        (client) => client.roles ?? [],
      ),
    ].filter((role): role is string => Boolean(role));

    return roles.find((role) => role.toUpperCase() === "VENDOR") ??
      roles.find((role) => role.toUpperCase() === "ADMIN") ??
      roles.find((role) => role.toUpperCase() === "USER");
  } catch {
    return undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/api/session",
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpiresAt = account.expires_at;
        token.role = getRoleFromAccessToken(account.access_token);
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.accessTokenExpiresAt = token.accessTokenExpiresAt;
      session.user.role = token.role;
      return session;
    },
  },
});
