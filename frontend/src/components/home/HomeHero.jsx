import { Link } from "react-router-dom"

import HeroStat from "./HeroStat"

export default function HomeHero({
  playersCount,
  matchesCount,
  tournamentsCount
}) {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-b
        border-slate-800
      "
    >
      {/* GLOW */}

      <div
        className="
          absolute
          top-[-200px]
          left-[-120px]

          w-[600px]
          h-[600px]

          rounded-full

          bg-orange-500/10

          blur-[180px]
        "
      />

      <div
        className="
          absolute
          right-[-200px]
          top-[0px]

          w-[500px]
          h-[500px]

          rounded-full

          bg-cyan-500/10

          blur-[160px]
        "
      />

      <div
        className="
          relative
          z-10

          max-w-[1700px]
          mx-auto

          px-6
          md:px-10

          py-28
          md:py-36
        "
      >
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-[1.2fr_0.8fr]
            gap-16
            items-center
          "
        >
          {/* LEFT */}

          <div>
            <div
              className="
                uppercase
                tracking-[0.35em]
                text-orange-400
                text-sm
                mb-6
              "
            >
              Отчёт ташаворила !!!
            </div>

            <h1
              className="
                text-6xl
                md:text-8xl
                font-black
                leading-[0.95]
                mb-8
              "
            >
              CS Лига 16:55
            </h1>

            <div
              className="
                text-gray-400
                text-xl
                md:text-2xl
                leading-relaxed
                max-w-[900px]
                mb-10
              "
            >
              Турнирная competitive-платформа
              с ELO рейтингом,
              достижениями,
              сезонной системой
              и полноценной
              progression ecosystem.
            </div>

            <div
              className="
                flex
                flex-wrap
                gap-5
              "
            >
              <Link
                to="/leaderboard"
                className="
                  bg-orange-500
                  hover:bg-orange-600

                  transition-all
                  duration-300

                  px-8
                  py-5

                  rounded-2xl

                  text-lg
                  font-black

                  shadow-[0_0_30px_rgba(249,115,22,0.25)]
                "
              >
                Рейтинг игроков
              </Link>

              <Link
                to="/tournaments"
                className="
                  bg-slate-900
                  border
                  border-slate-700

                  hover:border-orange-500/40

                  transition-all
                  duration-300

                  px-8
                  py-5

                  rounded-2xl

                  text-lg
                  font-bold
                "
              >
                Турниры
              </Link>
            </div>
          </div>

          {/* RIGHT */}

          <div
            className="
              grid
              grid-cols-2
              gap-5
            "
          >
            <HeroStat
              title="Игроков"
              value={playersCount}
              color="text-cyan-400"
            />

            <HeroStat
              title="Матчей"
              value={matchesCount}
              color="text-green-400"
            />

            <HeroStat
              title="Турниров"
              value={tournamentsCount}
              color="text-orange-400"
            />

            <HeroStat
              title="Сезон"
              value="LIVE"
              color="text-purple-400"
            />
          </div>
        </div>
      </div>
    </section>
  )
}