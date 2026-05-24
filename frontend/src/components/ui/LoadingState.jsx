export default function LoadingState({
  text = "Загрузка данных..."
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center

        min-h-[300px]

        rounded-3xl
        border
        border-slate-800
        bg-slate-950/60
      "
    >
      <div
        className="
          w-16
          h-16

          rounded-full

          border-4
          border-orange-500/20
          border-t-orange-500

          animate-spin
        "
      />

      <p className="mt-6 text-slate-400 font-bold">
        {text}
      </p>
    </div>
  )
}