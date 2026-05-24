export default function StatCard({
  title,
  value,
  color = "text-white"
}) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-6
      "
    >
      <div
        className="
          text-gray-400
          text-sm
          uppercase
          tracking-[0.2em]
          mb-3
        "
      >
        {title}
      </div>

      <div
        className={`
          text-4xl
          font-black
          ${color}
        `}
      >
        {value}
      </div>
    </div>
  )
}