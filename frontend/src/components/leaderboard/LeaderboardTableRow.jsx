import { Link } from "react-router-dom"

import RankBadge from "./RankBadge"

export default function LeaderboardTableRow({
  player,
  index,
  isLast
}) {
  return (
    <Link
      to={`/players/${player.id}`}
      className={`
        relative
        grid
        grid-cols-7
        gap-4
        px-8
        py-6
        ${
          !isLast
            ? (
                player.is_placement
                  ? "border-b border-yellow-500/10"
                  : "border-b border-slate-800/50"
              )
            : ""
        }
        items-center
        overflow-hidden
        transition-all
        duration-300
        ${
          player.is_placement
            ? `
              from-yellow-500/[0.08]
              to-slate-950
              border-yellow-500/20
            `
            : `
              from-slate-900
              to-slate-950
            `
        }
      `}
    >
      <div
        className={`
          absolute
          top-0
          right-0
          h-full
          w-[180px]
          blur-[80px]
          opacity-30
          ${
            player.is_placement
              ? "bg-yellow-500/20"
              : "bg-orange-500/10"
          }
        `}
      />

      <div
        className={`
          relative
          z-10
          w-12
          h-12
          rounded-2xl
          flex
          items-center
          justify-center
          text-lg
          font-black
          ${
            player.is_placement
              ? `
                bg-yellow-500/10
                text-yellow-400
                border
                border-yellow-500/20
              `
              : `
                bg-slate-800
                text-gray-300
              `
          }
        `}
      >
        {player.is_placement ? "⚡" : index + 4}
      </div>

      <div className="relative z-10 col-span-2">
        <div
          className={`
            text-xl
            font-black
            mb-1
            tracking-wide
            ${
              player.is_placement
                ? "text-yellow-100"
                : "text-white"
            }
          `}
        >
          {player.nickname}
        </div>

        <div
          className={`
            text-sm
            ${
              player.is_placement
                ? "text-yellow-400/70"
                : "text-gray-500"
            }
          `}
        >
          {
            player.is_placement
              ? `КАЛИБРОВКА • ${player.matches_played}/5`
              : `${player.matches_played} матчей`
          }
        </div>
      </div>

      <div
        className={`
          relative
          z-10
          text-2xl
          font-black
          ${
            player.is_placement
              ? "text-yellow-300"
              : "text-green-400"
          }
        `}
      >
        {player.is_placement ? "КАЛИБРОВКА" : player.elo}
      </div>

      <div className="relative z-10">
        {
          player.is_placement
            ? (
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-yellow-500/30
                  bg-yellow-500/10
                  text-yellow-300
                  font-bold
                  text-sm
                  shadow-[0_0_20px_rgba(234,179,8,0.12)]
                "
              >
                ⚡ КАЛИБРОВКА
              </div>
            )
            : (
              <RankBadge rank={player.rank} />
            )
        }
      </div>

      <div
        className={`
          relative
          z-10
          font-black
          text-lg
          ${
            player.is_placement
              ? "text-yellow-200"
              : "text-cyan-400"
          }
        `}
      >
        {player.winrate}%
      </div>

      <div
        className={`
          relative
          z-10
          font-black
          text-lg
          ${
            player.is_placement
              ? "text-yellow-300"
              : (
                  player.streak >= 5
                    ? "text-orange-300"
                    : player.streak >= 3
                      ? "text-orange-400"
                      : "text-gray-300"
                )
          }
        `}
      >
        {player.streak}
      </div>
    </Link>
  )
}