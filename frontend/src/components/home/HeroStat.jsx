export default function HeroStat({
  title,
  value,
  color = "text-white"
}) {
  return (
    <div
      className="
        bg-slate-900/70
        border
        border-slate-800
        rounded-3xl
        p-8
      "
    >
      <div
        className="
          text-gray-400
          uppercase
          tracking-[0.2em]
          text-sm
          mb-4
        "
      >
        {title}
      </div>

      <div
        className={`
          text-6xl
          font-black
          ${color}
        `}
      >
        {value}
      </div>
    </div>
  )
}