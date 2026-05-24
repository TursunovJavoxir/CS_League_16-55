export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = ""
}) {
  const variants = {
    default: "bg-slate-500/15 text-slate-300 border-slate-500/25",
    orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    blue: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30"
  }

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        font-bold
        backdrop-blur-sm
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {children}
    </span>
  )
}