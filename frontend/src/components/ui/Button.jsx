export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick
}) {
  const variants = {
    primary: `
      bg-orange-500
      hover:bg-orange-400
      text-white
      shadow-[0_0_30px_rgba(249,115,22,0.25)]
    `,
    secondary: `
      bg-white/5
      hover:bg-white/10
      text-slate-200
      border border-slate-700
      hover:border-orange-500/30
    `,
    danger: `
      bg-red-500/10
      hover:bg-red-500/20
      text-red-300
      border border-red-500/20
    `,
    success: `
      bg-emerald-500/10
      hover:bg-emerald-500/20
      text-emerald-300
      border border-emerald-500/20
    `,
    ghost: `
      bg-transparent
      hover:bg-white/5
      text-slate-300
      border border-transparent
    `
  }

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-5 py-3 text-sm rounded-2xl",
    lg: "px-6 py-4 text-base rounded-2xl"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-black
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {children}
    </button>
  )
}