import { Link } from "react-router-dom"
import SectionCard from "./SectionCard"

export default function TopPlayersSection({
  players = []
}) {
  return (
    <SectionCard
      title="Топ игроки"
      subtitle="Лучшие игроки платформы"
    >
      <div className="space-y-4">
        {players.map((player, index) => (
          <Link
            key={player.id}
            to={`/players/${player.id}`}
            className="
              flex
              items-center
              justify-between
              bg-slate-800/70
              border
              border-slate-700
              rounded-2xl
              p-5
              hover:border-orange-500/40
              transition-all
              duration-300
            "
          >
            <div className="flex items-center gap-5">
              <div className="text-4xl">
                {
                  index === 0
                    ? "🥇"
                    : index === 1
                      ? "🥈"
                      : "🥉"
                }
              </div>

              <div>
                <div className="text-2xl font-black">
                  {player.nickname}
                </div>

                <div className="text-gray-400">
                  {player.rank}
                </div>
              </div>
            </div>

            <div className="text-4xl font-black text-green-400">
              {player.elo}
            </div>
          </Link>
        ))}
      </div>
    </SectionCard>
  )
}