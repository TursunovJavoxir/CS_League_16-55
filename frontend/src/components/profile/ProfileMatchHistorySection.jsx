import MatchHistoryCard from "./MatchHistoryCard"

export default function ProfileMatchHistorySection({
  matches = [],
  player
}) {
  return (
    <div
      className="
        bg-slate-900
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
          Match History
        </div>

        <h2 className="text-5xl font-black">
          История матчей
        </h2>
      </div>

      {matches.length === 0 ? (
        <div
          className="
            text-gray-500
            text-xl
          "
        >
          У игрока пока нет истории матчей
        </div>
      ) : (
        <div className="space-y-5">
          {matches.map((match) => (
            <MatchHistoryCard
              key={match.id}
              match={match}
              player={player}
            />
          ))}
        </div>
      )}
    </div>
  )
}