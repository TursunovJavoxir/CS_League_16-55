export default function Panel({
  children,
  className = "",
  title,
  subtitle
}) {
  return (
    <section
      className={`
        rounded-3xl
        border
        border-slate-800
        bg-slate-950/70
        p-6
        md:p-8
        shadow-[0_0_40px_rgba(0,0,0,0.25)]
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  )
}