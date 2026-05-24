export default function ErrorState({
  title = "Произошла ошибка",
  description = "Не удалось загрузить данные.",
  action
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-red-500/20

        bg-red-500/5

        p-10
        md:p-14

        text-center

        shadow-[0_0_40px_rgba(239,68,68,0.08)]
      "
    >
      <div
        className="
          mx-auto
          mb-6

          w-16
          h-16

          rounded-3xl

          bg-red-500/10

          border
          border-red-500/20

          flex
          items-center
          justify-center

          text-3xl
          text-red-400
        "
      >
        !
      </div>

      <h2
        className="
          text-2xl
          md:text-3xl

          font-black

          text-red-400

          mb-3
        "
      >
        {title}
      </h2>

      <p
        className="
          text-slate-300
          max-w-xl
          mx-auto
        "
      >
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