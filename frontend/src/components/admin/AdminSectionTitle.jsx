export default function AdminSectionTitle({
  title,
  color = "orange"
}) {
  const colors = {
    orange: "bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)]",
    purple: "bg-purple-400",
    green: "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`
          w-3
          h-3
          rounded-full
          ${colors[color] || colors.orange}
        `}
      />

      <h2 className="text-2xl font-black text-white">
        {title}
      </h2>
    </div>
  )
}