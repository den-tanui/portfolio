import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const authConfig: NextAuthConfig = {
  providers: [GitHub],

  pages: {
    signIn: '/admin/login',
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoginPage = nextUrl.pathname === '/admin/login'
      const isAuthPage = nextUrl.pathname.startsWith('/api/auth')

      if (isLoginPage || isAuthPage) return true
      if (nextUrl.pathname.startsWith('/admin')) return !!auth

      return true
    },

    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },

  trustHost: true,
  secret: process.env.AUTH_SECRET,
}
