import SectionCard from "./SectionCard"

export default function LatestChampionSection({
  champion
}) {
  if (!champion) {
    return null
  }

  return (
    <SectionCard
      title="Последний чемпион"
      subtitle="Tournament prestige"
    >
      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-yellow-500/10
          to-orange-500/10
          border
          border-yellow-500/20
          rounded-3xl
          p-8
        "
      >
        <div
          className="
            absolute
            top-[-50px]
            right-[-50px]
            text-[160px]
            opacity-10
          "
        >
          🏆
        </div>

        <div className="relative z-10">
          <div
            className="
              text-yellow-300
              uppercase
              tracking-[0.25em]
              text-sm
              mb-4
            "
          >
            Champion
          </div>

          <div
            className="
              text-5xl
              font-black
              mb-5
              break-all
            "
          >
            {champion.winner}
          </div>

          <div className="text-gray-400">
            {champion.name}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}