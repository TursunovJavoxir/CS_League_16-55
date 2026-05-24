import {
  MATCH_STATUS
} from "../../constants/matchStatuses"

export default function TournamentHero({
  tournament,
  matches = [],
  finishedMatches = 0
}) {
  return (
    <div
      className="
        relative
        overflow-hidden

        rounded-[36px]

        border
        border-slate-800

        bg-gradient-to-br
        from-slate-900
        via-[#07122b]
        to-slate-950

        p-6
        lg:p-10

        mb-10

        shadow-2xl
      "
    >
      <div
        className="
          absolute
          inset-0

          bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_35%)]

          pointer-events-none
        "
      />

      <div className="relative z-10">
        <div
          className="
            flex
            flex-col
            xl:flex-row

            justify-between
            items-start

            gap-10

            mb-10
          "
        >
          <div>
            <div
              className="
                text-orange-400
                uppercase
                tracking-[0.35em]
                text-xs
                font-bold
                mb-4
              "
            >
              Внутренний турнир
            </div>

            <h1
              className="
                text-4xl
                md:text-6xl
                font-black
                text-white
                mb-4
              "
            >
              {tournament.name}
            </h1>

            <div
              className="
                text-slate-400
                text-lg
                max-w-2xl
              "
            >
              Визуализация турнирной сетки
              и live progression системы
            </div>
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-4
            "
          >
            <HeroStat
              title="Матчей"
              value={matches.length}
            />

            <HeroStat
              title="Завершено"
              value={finishedMatches}
              color="text-green-400"
            />

            <HeroStat
              title="BYE"
              value={tournament.bye_players?.length || 0}
              color="text-purple-400"
            />

            <HeroStat
              title="Статус"
              value={tournament.status}
              color={
                tournament.status === MATCH_STATUS.FINISHED
                  ? "text-green-400"
                  : "text-orange-400"
              }
              large={false}
            />
          </div>
        </div>

        {tournament.bye_players?.length > 0 && (
          <div className="mb-8">
            <div
              className="
                text-purple-300
                text-sm
                font-bold
                uppercase
                tracking-[0.2em]
                mb-4
              "
            >
              Прошли квалификацию автоматически по "Рейтингу"
            </div>

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              {tournament.bye_players.map((player, index) => (
                <div
                  key={index}
                  className="
                    px-4
                    py-2

                    rounded-xl

                    bg-purple-500/15

                    border
                    border-purple-500/25

                    text-purple-200

                    font-semibold
                  "
                >
                  {player}
                </div>
              ))}
            </div>
          </div>
        )}

        {tournament.status === MATCH_STATUS.FINISHED &&
          tournament.winner && (
            <div
              className="
                relative
                overflow-hidden

                rounded-3xl

                border
                border-amber-400/20

                bg-gradient-to-r
                from-amber-500/15
                via-yellow-400/5
                to-amber-500/15

                p-6
                lg:p-8
              "
            >
              <div
                className="
                  absolute
                  inset-0

                  bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12),transparent_70%)]
                "
              />

              <div
                className="
                  relative
                  z-10

                  flex
                  flex-col
                  lg:flex-row

                  items-center
                  justify-between

                  gap-8
                "
              >
                <div>
                  <div
                    className="
                      text-amber-300
                      text-xs
                      font-bold
                      tracking-[0.35em]
                      uppercase
                      mb-4
                    "
                  >
                    Champion
                  </div>

                  <div
                    className="
                      text-4xl
                      lg:text-6xl
                      font-black
                      text-white
                      mb-3
                    "
                  >
                    {tournament.winner}
                  </div>

                  <div
                    className="
                      text-amber-100/80
                      text-lg
                    "
                  >
                    Победитель турнира {tournament.name}
                  </div>
                </div>

                <div
                  className="
                    text-[90px]
                    lg:text-[120px]

                    drop-shadow-[0_0_25px_rgba(251,191,36,0.45)]
                  "
                >
                  🏆
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

function HeroStat({
  title,
  value,
  color = "text-white",
  large = true
}) {
  return (
    <div
      className="
        bg-slate-800/80

        border
        border-slate-700

        rounded-2xl

        px-5
        py-4

        min-w-[140px]
      "
    >
      <div className="text-slate-400 text-sm mb-1">
        {title}
      </div>

      <div
        className={`
          font-bold
          ${large ? "text-2xl" : "text-xl"}
          ${color}
        `}
      >
        {value}
      </div>
    </div>
  )
}