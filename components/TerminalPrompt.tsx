export default function TerminalPrompt({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 text-sm">
      <span className="text-tertiary font-bold">➜</span>
      <span className="text-cyan">{path}</span>
      <span className="w-2 h-4 bg-on-surface animate-pulse" />
    </div>
  )
}
