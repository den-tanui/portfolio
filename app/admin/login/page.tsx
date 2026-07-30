import { signIn } from '@/lib/auth'
import TerminalPrompt from '@/components/TerminalPrompt'
import { OAuthButton } from './auth-buttons'

export default function LoginPage() {
  return (
    <div className="fixed top-10 bottom-8 left-0 right-0 flex items-center justify-center">
      <div className="max-w-sm mx-4 w-full">
        <TerminalPrompt path="~/admin/login" />
        <div className="border border-outline rounded-lg bg-surface-container p-6">
          <h1 className="text-sm font-bold text-on-surface mb-1 text-center">admin login</h1>
          <p className="text-[11px] text-on-surface-muted mb-4 text-center">
            Sign in with your GitHub account to manage content.
          </p>

          <form
            action={async () => {
              'use server'
              await signIn('github', { redirectTo: '/admin' })
            }}
          >
            <OAuthButton provider="github" />
          </form>
        </div>
      </div>
    </div>
  )
}
