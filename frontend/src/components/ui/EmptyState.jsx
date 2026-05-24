export default function EmptyState({
  title = "Данных пока нет",
  description = "Здесь появится информация после загрузки или создания данных.",
  action
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-950/70

        p-10
        md:p-14

        text-center

        shadow-[0_0_40px_rgba(0,0,0,0.25)]
      "
    >
      <div
        className="
          mx-auto
          mb-6

          w-16
          h-16

          rounded-3xl

          bg-orange-500/10
          border
          border-orange-500/20

          flex
          items-center
          justify-center

          text-3xl
        "
      >
        —
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
        {title}
      </h2>

      <p className="text-slate-400 max-w-xl mx-auto">
        {description}
      </p>

      {action && (
        <div className="mt-7">
          {action}
        </div>
      )}
    </div>
  )
}