import RankBadge from "./RankBadge"

export default function ProfileHero({
  player,
  recentForm
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-slate-800
        bg-gradient-to-br
        from-slate-900
        via-slate-900
        to-slate-950
        mb-10
      "
    >
      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]
          w-[420px]
          h-[420px]
          rounded-full
          blur-[150px]
          opacity-20
          bg-orange-500
        "
      />

      <div
        className="
          relative
          z-10
          p-10
          md:p-14
        "
      >
        <div
          className="
            flex
            flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-10
          "
        >
          <div>
            <div
              className="
                uppercase
                tracking-[0.35em]
                text-orange-400
                text-sm
                mb-5
              "
            >
              Соревновательный профиль
            </div>

            <h1
              className="
                text-6xl
                md:text-7xl
                font-black
                mb-5
                leading-none
              "
            >
              {player?.nickname}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              {player?.is_placement ? (
                <div
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    border
                    border-yellow-500/30
                    bg-yellow-500/10
                    text-yellow-300
                    font-bold
                    text-lg
                  "
                >
                  Ранг скрыт до завершения калибровки
                </div>
              ) : (
                <RankBadge rank={player?.rank} />
              )}

              {player?.is_placement && (
                <div
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    border
                    border-yellow-500/30
                    bg-yellow-500/10
                    text-yellow-300
                    font-bold
                    text-lg
                  "
                >
                  Калибровка: {player.placement_matches}/5
                </div>
              )}

              <div
                className="
                  bg-slate-800/80
                  border
                  border-slate-700
                  px-5
                  py-3
                  rounded-2xl
                  text-gray-300
                  font-semibold
                "
              >
                Матчей: {player?.matches_played}
              </div>
            </div>
          </div>

          <div className="text-left xl:text-right">
            <div
              className="
                text-gray-400
                uppercase
                tracking-[0.25em]
                text-sm
                mb-4
              "
            >
              {player?.is_placement ? "Калибровка" : "Текущий ELO"}
            </div>

            <div
              className="
                text-7xl
                md:text-8xl
                font-black
                text-green-400
                leading-none
                mb-6
              "
            >
              {player?.is_placement ? "???" : player?.elo}
            </div>

            <div className="flex justify-start xl:justify-end gap-3">
              {recentForm.map((result, index) => (
                <div
                  key={index}
                  className={`
                    w-12
                    h-12
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    font-black
                    text-lg
                    border

                    ${
                      result === "win"
                        ? `
                          bg-green-500/15
                          border-green-500/30
                          text-green-400
                        `
                        : `
                          bg-red-500/15
                          border-red-500/30
                          text-red-400
                        `
                    }
                  `}
                >
                  {result === "win" ? "W" : "L"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}