export default function AdvancedMatchCard({

  match,

  hoveredPlayer,

  setHoveredPlayer

}) {

  const isFinished =
    match.status === "finished"

  const score =
    match.score || ""

  const recentlyFinished =
    isFinished &&
    match.winner &&
    score

  const isPending =
    match.status === "pending"

  const isWaiting =
    match.status === "waiting"

  const winner =
    match.winner

  

  const [score1, score2] =
    score.includes("-") || score.includes(":")
      ? score.includes("-")
        ? score.split("-")
        : score.split(":")
      : ["", ""]

  const player1Winner =
    winner === match.player1
    &&
    match.player1
    &&
    match.player1 !== "TBD"

  const player2Winner =
    winner === match.player2
    &&
    match.player2
    &&
    match.player2 !== "TBD"

  return (

    <div
      className={`
        group
        relative

        bg-slate-900/95

        border
        rounded-3xl

        p-4

        min-w-[320px]

        backdrop-blur-md

        transition-all
        duration-500

        overflow-hidden

        hover:scale-[1.035]
        hover:-translate-y-1

        ${
          isPending
            ? `
              border-orange-400/50

              shadow-[0_0_55px_rgba(255,123,0,0.20)]

              animate-[liveCardPulse_3.5s_ease-in-out_infinite]
            `
            : isFinished
            ? `
              border-green-500/30

              shadow-[0_0_28px_rgba(34,197,94,0.10)]
            `
            : `
              border-slate-700/80

              opacity-95
            `
        }

        
        ${
          recentlyFinished
            ? `
              animate-[winnerReveal_1.8s_cubic-bezier(0.22,1,0.36,1)]
            `
            : ""
        }

        ${
          hoveredPlayer &&
          (
            match.player1 === hoveredPlayer ||
            match.player2 === hoveredPlayer ||
            match.winner === hoveredPlayer
          )

            ? `
              ring-2
              ring-orange-400/40

              shadow-[0_0_50px_rgba(255,120,0,0.18)]

              scale-[1.015]

              z-20
            `

            : hoveredPlayer

              ? `
                opacity-50
              `

              : ""
        }

        hover:border-orange-500/50

        hover:shadow-[0_0_45px_rgba(255,123,0,0.18)]
      `}
    >

      {/* BACKGROUND GLOW */}

      <div
        className={`
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-500
          
          ${
            isPending
              ? `
                bg-[radial-gradient(circle_at_top,rgba(255,123,0,0.14),transparent_70%)]

                group-hover:opacity-100
              `
              : ""
          }
        `}
      />

      {/* HEADER */}

      <div
        className="
          relative
          z-10

          flex
          justify-between
          items-center

          mb-5
        "
      >

        <div
          className="
            text-orange-400
            font-black
            text-xs
            tracking-[0.18em]
            uppercase
          "
        >

          {match.round}

        </div>

        <div>

          {isFinished ? (

            <div
              className="
                flex
                items-center
                gap-2

                bg-green-500/15
                text-green-400

                px-3
                py-1.5

                rounded-xl

                text-[11px]
                font-black

                border
                border-green-500/30

                animate-[winnerBadgeGlow_2.5s_ease-in-out_infinite]
              "
            >

              <div
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-400
                "
              />

              FINISHED
              
            </div>
            

          ) : isWaiting ? (

            <div
              className="
                bg-slate-700/40
                text-slate-400

                px-3
                py-1.5

                rounded-xl

                text-[11px]
                font-black

                border
                border-slate-600/40
              "
            >

              WAITING

            </div>

          ) : (

            <div
              className="
                flex
                items-center
                gap-2

                bg-red-500/15
                text-red-300

                px-3
                py-1.5

                rounded-xl

                text-[11px]
                font-black

                border
                border-red-500/30

                shadow-[0_0_18px_rgba(239,68,68,0.14)]
              "
            >

              <div
                className="
                  relative
                  flex
                  items-center
                  justify-center
                "
              >

                <div
                  className="
                    absolute
                    w-2
                    h-2
                    rounded-full
                    bg-red-400
                    animate-ping
                  "
                />

                <div
                  className="
                    relative
                    w-2
                    h-2
                    rounded-full
                    bg-red-400
                  "
                />

              </div>

              LIVE NOW

            </div>

          )}

        </div>

      </div>

      {/* PLAYERS */}

      <div
        className="
          relative
          z-10
          space-y-3
        "
      >

        {/* PLAYER 1 */}

        <div
          data-player-slot="player1"
          className={`
            flex
            justify-between
            items-center

            rounded-2xl

            px-4
            py-3.5

            border

            transition-all
            duration-300

            ${
              player1Winner
                ? `
                  bg-green-500/18

                  border-green-500

                  text-white

                  shadow-[0_0_35px_rgba(34,197,94,0.24)]

                  scale-[1.015]
                `
                : isFinished
                  ? `
                      bg-slate-800/70

                      border-slate-700

                      text-slate-400

                      opacity-75
                    `
                  : `
                      bg-slate-800/95

                      border-slate-700

                      text-gray-100
                    `
            }
          `}
        >

          <div
            onMouseEnter={() =>
              setHoveredPlayer(match.player1)
            }

            onMouseLeave={() =>
              setHoveredPlayer(null)
            }

            className="
              font-bold
              truncate
              text-[15px]
            "
          >

            {
              match.player1 ? (

                match.player1

              ) : (

                <span className="text-slate-500">
                  TBD
                </span>

              )
            }
            

          </div>

          <div
            className={`
              font-black
              text-xl

              ${
                player1Winner
                  ? "text-green-300"
                  : "text-white"
              }
            `}
          >

            {score1}

          </div>

        </div>

        {/* PLAYER 2 */}

        <div
          data-player-slot="player2"
          className={`
            flex
            justify-between
            items-center

            rounded-2xl

            px-4
            py-3.5

            border

            transition-all
            duration-300

            ${
              player2Winner
                ? `
                  bg-green-500/18

                  border-green-500

                  text-white

                  shadow-[0_0_35px_rgba(34,197,94,0.24)]

                  scale-[1.015]
                `
                : isWaiting
                ? `
                  bg-slate-800/88

                  border-slate-700

                  text-slate-300
                `
                : isFinished
                  ? `
                      bg-slate-800/70

                      border-slate-700

                      text-slate-400

                      opacity-75
                    `
                  : `
                    bg-slate-800/95

                    border-slate-700

                    text-gray-100
                  `
            }
          `}
        >

          <div
            onMouseEnter={() =>
              setHoveredPlayer(match.player2)
            }

            onMouseLeave={() =>
              setHoveredPlayer(null)
            }

            className="
              font-bold
              truncate
              text-[15px]
            "
          >

            {
              match.player2 ? (

                match.player2

              ) : (

                <span className="text-slate-500">
                  TBD
                </span>

              )
            }

          </div>

          <div
            className={`
              font-black
              text-xl

              ${
                player2Winner
                  ? "text-green-300"
                  : ""
              }
            `}
          >

            {
              match.player2
                ? score2
                : ""
            }

          </div>

        </div>

      </div>

      {/* LIVE SIDE GLOW */}

      {isPending && (

        <div
          className="
            absolute
            left-0
            top-0
            bottom-0

            w-[3px]

            bg-gradient-to-b
            from-red-400
            via-orange-400
            to-red-400

            shadow-[0_0_20px_rgba(255,80,80,0.6)]
          "
        />

      )}

    </div>

  )

}