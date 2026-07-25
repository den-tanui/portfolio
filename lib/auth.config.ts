import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'password',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return { id: 'admin', name: 'Admin' }
        }
        return null
      },
    }),
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [GitHub({ allowDangerousEmailAccountLinking: true })]
      : []),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google({ allowDangerousEmailAccountLinking: true })]
      : []),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAdmin = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'
      const authMode = process.env.AUTH_MODE || 'cookie'

      // In oauth mode, the client handles auth — middleware doesn't block
      if (authMode === 'oauth') return true

      // Allow login page always
      if (isLoginPage) return true

      // Protect admin routes
      if (isAdmin && !auth) return false

      return true
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
}
