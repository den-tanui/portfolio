export default function LangPill({ lang, onClick }: { lang: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-surface-container-highest text-tertiary rounded hover:bg-tertiary hover:text-on-tertiary transition-colors min-h-[28px] hover-scale"
    >
      {lang}
    </button>
  )
}
