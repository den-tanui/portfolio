import { auth, signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TerminalPrompt from '@/components/TerminalPrompt'
import { AuthButton, OAuthButton } from './auth-buttons'
import GitHubDeviceFlow from '@/components/GitHubDeviceFlow'

/* ───── Server Actions ───── */

async function handlePasswordLogin(formData: FormData) {
  'use server'
  await signIn('credentials', {
    password: formData.get('password'),
    redirectTo: '/admin',
  })
}

async function handleGithubLogin() {
  'use server'
  await signIn('github', { redirectTo: '/admin' })
}

async function handleGoogleLogin() {
  'use server'
  await signIn('google', { redirectTo: '/admin' })
}

/* ───── Page ───── */

export default async function LoginPage() {
  const session = await auth()
  const authMode = process.env.AUTH_MODE || 'cookie'

  if (session) redirect('/admin')

  const hasOAuth = process.env.AUTH_GITHUB_ID || process.env.AUTH_GOOGLE_ID

  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 flex items-center justify-center">
      <div className="max-w-sm mx-4 w-full">
        <TerminalPrompt path="~/admin/login" />
        <div className="border border-outline rounded-lg bg-surface-container p-6">
          <h1 className="text-xs font-bold text-on-surface mb-1">authentication required</h1>
          <p className="text-[11px] text-on-surface-muted mb-6">
            {authMode === 'cookie'
              ? 'Sign in to manage your content.'
              : 'Authenticate with GitHub to manage your content.'}
          </p>

          {authMode === 'cookie' ? (
            <div className="space-y-4">
              <form action={handlePasswordLogin} className="space-y-3">
                <div>
                  <label className="text-on-surface-muted text-[11px] block mb-1">password</label>
                  <input
                    name="password"
                    type="password"
                    autoFocus
                    className="w-full px-2 py-1.5 bg-surface-container-high border border-outline rounded text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-muted/50"
                    placeholder="Enter admin password"
                  />
                </div>
                <AuthButton />
              </form>

              {hasOAuth && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 h-px bg-outline-variant" />
                    <span className="text-[10px] text-on-surface-muted uppercase">or</span>
                    <span className="flex-1 h-px bg-outline-variant" />
                  </div>

                  <div className="space-y-2">
                    {process.env.AUTH_GITHUB_ID && (
                      <form action={handleGithubLogin}>
                        <OAuthButton provider="github" />
                      </form>
                    )}
                    {process.env.AUTH_GOOGLE_ID && (
                      <form action={handleGoogleLogin}>
                        <OAuthButton provider="google" />
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You&apos;ll be prompted to authorize this app on GitHub. A secure
                token will be stored in your browser session.
              </p>
              <GitHubDeviceFlow />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
