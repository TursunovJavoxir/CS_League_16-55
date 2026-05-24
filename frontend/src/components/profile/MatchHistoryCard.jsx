export default function MatchHistoryCard({
  match,
  player
}) {
  const isWin =
    match.result === "win"

  const isPending =
    !match.result

  const safeEloChange =
    match.elo_change || "0/0"

  const eloText =
    isPending
      ? "0"
      : isWin
        ? safeEloChange.split("/")[0]
        : safeEloChange.split("/")[1]

  const score =
    match.score || "0:0"

  const scoreParts =
    score.split(":")

  const formattedScore =
    scoreParts.length === 2
      ? score
      : "—"

  return (
    <div
      className={`
        rounded-3xl
        border
        p-7
        transition-all
        duration-300

        ${
          isPending
            ? `
              bg-yellow-500/5
              border-yellow-500/20
              hover:border-yellow-400/40
            `
            : isWin
              ? `
                bg-green-500/5
                border-green-500/20
                hover:border-green-400/40
              `
              : `
                bg-red-500/5
                border-red-500/20
                hover:border-red-400/40
              `
        }
      `}
    >
      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
        "
      >
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            <div
              className={`
                px-4
                py-2
                rounded-xl
                text-sm
                font-black

                ${
                  isPending
                    ? `
                      bg-yellow-500/20
                      text-yellow-300
                    `
                    : isWin
                      ? `
                        bg-green-500/20
                        text-green-400
                      `
                      : `
                        bg-red-500/20
                        text-red-400
                      `
                }
              `}
            >
              {
                isPending
                  ? "ОЖИДАЕТ ИГРУ"
                  : isWin
                    ? "ПОБЕДА"
                    : "ПОРАЖЕНИЕ"
              }
            </div>

            <div
              className="
                px-4
                py-2
                rounded-xl
                bg-orange-500/10
                border
                border-orange-500/20
                text-orange-300
                text-sm
              "
            >
              {match.match_type}
            </div>

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
              {match.season}
            </div>
          </div>

          <div
            className="
              text-3xl
              font-black
              mb-3
            "
          >
            vs {match.opponent || "—"}
          </div>

          <div className="text-gray-400 text-lg">
            Счёт: {formattedScore}
          </div>
        </div>

        <div className="text-left xl:text-right">
          <div
            className={`
              text-5xl
              font-black
              mb-3

              ${
                isPending
                  ? "text-yellow-300"
                  : isWin
                    ? "text-green-400"
                    : "text-red-400"
              }
            `}
          >
            {
              player?.is_placement
                ? "???"
                : eloText
            }
          </div>

          <div className="text-gray-400">
            {
              player?.is_placement
                ? "Калибровочный матч"
                : "Изменение ELO"
            }
          </div>
        </div>
      </div>
    </div>
  )
}