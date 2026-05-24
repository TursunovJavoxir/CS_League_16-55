export default function Card({
  children,
  className = "",
  hover = true,
  glow = false
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-gradient-to-b
        from-slate-900
        to-slate-950
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(249,115,22,0.14)]" : ""}
        ${className}
      `}
    >
      {glow && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_60%)]
          "
        />
      )}

      <div className="relative">
        {children}
      </div>
    </div>
  )
}