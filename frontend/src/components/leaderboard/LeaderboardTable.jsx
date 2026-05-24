import LeaderboardTableRow from "./LeaderboardTableRow"

export default function LeaderboardTable({
  players
}) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-[32px]
        overflow-hidden
      "
    >
      <div
        className="
          grid
          grid-cols-7
          gap-4
          px-8
          py-5
          border-b
          border-slate-800
          text-gray-400
          uppercase
          tracking-[0.2em]
          text-sm
        "
      >
        <div>#</div>

        <div className="col-span-2">
          Игрок
        </div>

        <div>ELO</div>

        <div>Ранг</div>

        <div>Winrate</div>

        <div>Серия</div>
      </div>

      <div>
        {players.map((player, index) => (
          <LeaderboardTableRow
            key={player.id}
            player={player}
            index={index}
            isLast={index === players.length - 1}
          />
        ))}
      </div>
    </div>
  )
}