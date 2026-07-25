export default function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="border border-outline rounded-lg overflow-hidden my-4">
      {/* Traffic light dots header */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-dim border-b border-outline-variant">
        <span className="w-2.5 h-2.5 rounded-full bg-error" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow" />
        <span className="w-2.5 h-2.5 rounded-full bg-success" />
        <span className="ml-auto text-xs text-on-surface-muted">{language}</span>
      </div>
      <pre className="p-3 bg-surface-dim overflow-x-auto">
        <code className="text-xs text-on-surface leading-relaxed">{code}</code>
      </pre>
    </div>
  )
}
