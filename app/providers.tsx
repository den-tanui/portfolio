'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ThemeProvider } from '@/context/ThemeContext'
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import { ToastProvider, useToast } from '@/context/ToastContext'
import ToastContainer from '@/components/ToastContainer'
import SessionProvider from '@/components/SessionProvider'
import { useLenis } from '@/hooks/useLenis'
import { useKeyboard } from '@/hooks/useKeyboard'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import HelpModal from '@/components/HelpModal'
import ContactModal from '@/components/ContactModal'
import CvPicker from '@/components/CvPicker'
import ReportModal from '@/components/ReportModal'
import { useTheme } from '@/context/ThemeContext'

// Pages that handle / locally (blog, projects, search indexes)
const SEARCH_PAGES = new Set(['/blog', '/projects', '/search'])

function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme: rawToggleTheme } = useTheme()
  const { fontSize, setFontSize, zoom } = useSettings()
  const { addToast } = useToast()
  const [helpOpen, setHelpOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [cvOpen, setCvOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Initialize Lenis smooth scroll
  useLenis()

  // Apply font-size and zoom to root
  useEffect(() => {
    document.documentElement.style.fontSize = `${(fontSize / 100) * 16}px`
  }, [fontSize])

  useEffect(() => {
    document.body.style.zoom = `${zoom}%`
  }, [zoom])

  // Wrap toggleTheme to fire a toast notification
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    rawToggleTheme()
    addToast('info', `Switched to ${next === 'dark' ? 'Night' : 'Moon'} theme`)
  }

  // Global keyboard shortcuts — fired on every page
  useKeyboard([
    // Help
    { key: '?', handler: () => setHelpOpen((v) => !v) },

    // Close everything
    { key: 'Escape', handler: () => { setHelpOpen(false); setContactOpen(false); setCvOpen(false); setReportOpen(false); setSettingsOpen(false) } },

    // Number nav — map 0-3 to routes
    { key: '0', handler: () => router.push('/') },
    { key: '1', handler: () => router.push('/blog') },
    { key: '2', handler: () => router.push('/projects') },
    { key: '3', handler: () => router.push('/about') },

    // Scroll
    { key: 'g', handler: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { key: 'G', handler: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },

    // / — route to /search (unless current page has its own / handler)
    { key: '/', preventDefault: true, handler: () => {
      if (!SEARCH_PAGES.has(pathname)) {
        router.push('/search')
      }
    }},
  ])

  return (
    <>
      <AppHeader
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onOpenCv={() => setCvOpen(true)}
        onOpenReport={() => setReportOpen(true)}
        settingsOpen={settingsOpen}
        onToggleSettings={() => setSettingsOpen((v) => !v)}
        onCloseSettings={() => setSettingsOpen(false)}
      />

      <main id="main-scroll" className="flex-1 pt-10 pb-8 scroll-mt-10">
        {children}
      </main>

      <AppFooter onOpenHelp={() => setHelpOpen((v) => !v)} />

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <CvPicker isOpen={cvOpen} onClose={() => setCvOpen(false)} />
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
      <ToastContainer />
    </>
  )
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SettingsProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
