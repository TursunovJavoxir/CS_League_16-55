export default function SectionCard({
  title,
  subtitle,
  children
}) {
  return (
    <div
      className="
        bg-slate-900/70
        border
        border-slate-800
        rounded-[32px]
        p-8
      "
    >
      <div className="mb-8">
        <div
          className="
            uppercase
            tracking-[0.3em]
            text-orange-400
            text-sm
            mb-3
          "
        >
          {subtitle}
        </div>

        <h2
          className="
            text-4xl
            font-black
          "
        >
          {title}
        </h2>
      </div>

      {children}
    </div>
  )
}