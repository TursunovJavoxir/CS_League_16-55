import { Link } from "react-router-dom"

import RankBadge from "./RankBadge"

export default function TopPlayerCard({
  player,
  position
}) {

  const medals = {

    1: "🥇",
    2: "🥈",
    3: "🥉"

  }

  return (

    <Link
      to={`/players/${player.id}`}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-800
        bg-gradient-to-br
        from-slate-900
        to-slate-950
        p-8
        hover:border-orange-500/30
        transition-all
        duration-300
      "
    >

      <div
        className="
          absolute
          top-[-80px]
          right-[-80px]
          w-[240px]
          h-[240px]
          rounded-full
          bg-orange-500/10
          blur-[100px]
        "
      />

      <div className="relative z-10">

        <div className="text-5xl mb-6">

          {medals[position]}

        </div>

        <div
          className="
            text-gray-400
            uppercase
            tracking-[0.2em]
            text-sm
            mb-2
          "
        >
          TOP #{position}
        </div>

        <div
          className="
            text-4xl
            font-black
            mb-5
          "
        >
          {player.nickname}
        </div>

        <div
          className="
            text-6xl
            font-black
            text-green-400
            mb-6
          "
        >
          {
            player.is_placement
              ? "???"
              : player.elo
          }
        </div>

        <div className="flex flex-wrap gap-3 mb-6">

          {
            player.is_placement

              ? (

                <div
                  className="
                    inline-flex
                    items-center
                    px-4
                    py-2
                    rounded-xl
                    border
                    border-yellow-500/30
                    bg-yellow-500/10
                    text-yellow-300
                    font-bold
                    text-sm
                  "
                >

                  КАЛИБРОВКА

                </div>

              )

              : (

                <RankBadge rank={player.rank} />

              )
          }

          <div
            className="
              px-4
              py-2
              rounded-xl
              bg-slate-800
              text-gray-300
              text-sm
            "
          >
            WR {player.winrate}%
          </div>

        </div>

        <div className="text-gray-400">

          Побед: {player.wins}

        </div>

      </div>

    </Link>

  )
}