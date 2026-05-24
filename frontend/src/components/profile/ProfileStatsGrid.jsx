import StatCard from "./StatCard"

export default function ProfileStatsGrid({
  player
}) {
  return (
    <div
      className="
        grid
        grid-cols-2
        xl:grid-cols-6
        gap-5
        mb-10
      "
    >
      <StatCard
        title="Победы"
        value={player?.wins}
        color="text-green-400"
      />

      <StatCard
        title="Поражения"
        value={player?.losses}
        color="text-red-400"
      />

      <StatCard
        title="Винрейт"
        value={`${player?.winrate}%`}
        color="text-cyan-400"
      />

      <StatCard
        title="MVP"
        value={player?.mvp}
        color="text-yellow-400"
      />

      <StatCard
        title="Серия"
        value={player?.streak}
        color="text-orange-400"
      />

      <StatCard
        title={
          player?.is_placement
            ? "Peak"
            : "Peak ELO"
        }
        value={
          player?.is_placement
            ? "???"
            : player?.peak_elo
        }
        color="text-purple-400"
      />
    </div>
  )
}