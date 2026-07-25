export default function TagPill({ tag, onClick }: { tag: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-surface-container-highest text-primary rounded hover:bg-primary hover:text-on-primary transition-colors min-h-[28px] hover-scale"
    >
      #{tag}
    </button>
  )
}
