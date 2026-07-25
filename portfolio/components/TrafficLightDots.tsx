export default function TrafficLightDots() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-surface-dim border-b border-outline-variant rounded-t-lg">
      <span className="w-2.5 h-2.5 rounded-full bg-error" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow" />
      <span className="w-2.5 h-2.5 rounded-full bg-success" />
    </div>
  )
}
