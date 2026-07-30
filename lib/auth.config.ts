import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const authConfig: NextAuthConfig = {
  providers: [GitHub],

  pages: {
    signIn: '/admin/login',
  },

  callbacks: {
    async signIn({ account }) {
      if (account?.provider === 'github') {
        return account.providerAccountId === process.env.ADMIN_GITHUB_ID
      }
      return false
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoginPage = nextUrl.pathname === '/admin/login'
      const isAuthPage = nextUrl.pathname.startsWith('/api/auth')
      const isAdminPath = nextUrl.pathname === '/admin' || nextUrl.pathname.startsWith('/admin/')

      if (isLoginPage || isAuthPage) return true
      if (isAdminPath) return !!auth

      return true
    },

    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },

    async session({ session, token }) {
      if (token.accessToken && typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken
      }
      return session
    },
  },

  secret: process.env.AUTH_SECRET,
}
