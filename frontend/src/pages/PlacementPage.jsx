import {
  useEffect,
  useState
} from "react"


import { apiFetch } from "../utils/api"

import {
  Link
} from "react-router-dom"

import { translateRank } from "../utils/translations"
import { useAuth } from "../context/AuthContext"


export default function PlacementPage() {

  const { currentPlayer } = useAuth()
  
  const nickname =
    currentPlayer?.nickname

  const [player, setPlayer] =
    useState(null)


  const [searching, setSearching] = 
    useState(false)
  
    const findPlacementMatch = async () => {

    if (!player) return

    try {

        setSearching(true)

        const res = await apiFetch(

        `/players/${player.id}/placement-opponent`

        )

        const data = await res.json()

        if (!res.ok) {

        alert(

            data.detail ||

            "Ошибка matchmaking"
        )

        setSearching(false)

        return
        }

        alert(

        `Placement матч создан!\n\n` +

        `${data.player} vs ${data.opponent}`
        )

        window.location.reload()

    } catch (err) {

        console.error(err)

    }

    setSearching(false)
    }
    


  useEffect(() => {

    if (!nickname) return

    apiFetch(
      `/players/nickname/${nickname}`
    )
      .then(res => res.json())
      .then(data => {

        return apiFetch(
          `/players/${data.id}`
        )

      })
      .then(res => res.json())
      .then(data => {

        setPlayer(data)

      })

  }, [nickname])

  return (

    <div
      className="
        min-h-screen
        bg-[#020617]
        text-white
        overflow-hidden
      "
    >

      {/* HERO */}

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
            left-[-100px]

            w-[500px]
            h-[500px]

            rounded-full

            bg-yellow-500/10

            blur-[180px]
          "
        />

        <div
          className="
            absolute
            right-[-150px]
            top-[0px]

            w-[450px]
            h-[450px]

            rounded-full

            bg-orange-500/10

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
          "
        >

          <div
            className="
              max-w-[1000px]
            "
          >

            <div
              className="
                uppercase
                tracking-[0.35em]
                text-yellow-400
                text-sm
                mb-6
              "
            >

              Competitive Calibration

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

              PLACEMENT
              <br />
              MATCHES

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

              Пройди калибровку,
              получи скрытый рейтинг
              и открой свой
              Competitive Rank.

            </div>

            
            {
            player && (

                <div className="w-full max-w-[850px]">

                {/* TOP STATUS */}

                <div
                    className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-6

                    rounded-[32px]

                    border
                    border-yellow-500/20

                    bg-yellow-500/10

                    px-8
                    py-7

                    mb-6
                    "
                >

                    <div
                    className="
                        flex
                        items-center
                        gap-5
                    "
                    >

                    <div
                        className="
                        text-yellow-300
                        text-6xl
                        font-black
                        "
                    >

                        {player.placement_matches}/5

                    </div>

                    <div>

                        <div
                        className="
                            text-white
                            font-black
                            text-2xl
                            mb-2
                        "
                        >

                        Placement Progress

                        </div>

                        <div
                        className="
                            text-yellow-200/70
                            text-lg
                        "
                        >

                        Калибровочные матчи

                        </div>

                    </div>

                    </div>

                    <div
                    className="
                        flex
                        flex-col
                        items-start
                        md:items-end
                    "
                    >

                    <div
                        className="
                        uppercase
                        tracking-[0.25em]
                        text-yellow-400
                        text-xs
                        mb-2
                        "
                    >

                        STATUS
                    </div>

                    <div
                        className="
                        text-2xl
                        font-black
                        "
                    >

                        {
                        player.is_placement

                            ? "КАЛИБРОВКА АКТИВНА"

                            : "КАЛИБРОВКА ЗАВЕРШЕНА"
                        }

                    </div>

                    </div>

                </div>

                {/* PROGRESS BAR */}

                <div
                    className="
                    w-full
                    h-6

                    rounded-full

                    bg-slate-900

                    overflow-hidden

                    border
                    border-slate-800

                    mb-6
                    "
                >

                    <div
                    className="
                        h-full

                        bg-gradient-to-r
                        from-yellow-400
                        to-orange-500

                        transition-all
                        duration-700

                        shadow-[0_0_30px_rgba(234,179,8,0.45)]
                    "

                    style={{
                        width: `${(player.placement_matches / 5) * 100}%`
                    }}
                    />

                </div>

                {/* STATS */}

                <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    "
                >

                    <PlacementStat
                    title="Завершено"
                    value={player.placement_matches}
                    color="text-green-400"
                    />

                    <PlacementStat
                    title="Осталось"
                    value={5 - player.placement_matches}
                    color="text-yellow-300"
                    />

                    <PlacementStat
                    title="Скрытый рейтинг"
                    value="???"
                    color="text-cyan-400"
                    />

                </div>

                </div>

            )
            }
            


          </div>

        </div>

      </section>

      {/* CONTENT */}

      <div
        className="
          max-w-[1700px]
          mx-auto
          px-6
          md:px-10
          py-14
        "
      >
        
        
        {
        player &&
        !player.is_placement && (

            <section className="mb-14">

            <div
                className="
                relative
                overflow-hidden

                rounded-[40px]

                border
                border-emerald-500/20

                bg-gradient-to-br
                from-emerald-500/10
                via-transparent
                to-cyan-500/10

                p-12
                "
            >

                {/* GLOW */}

                <div
                className="
                    absolute
                    top-[-120px]
                    right-[-120px]

                    w-[320px]
                    h-[320px]

                    rounded-full

                    bg-emerald-400/20

                    blur-[120px]
                "
                />

                <div className="relative z-10">

                <div
                    className="
                    uppercase
                    tracking-[0.35em]
                    text-emerald-400
                    text-sm
                    mb-5
                    "
                >

                    Калибровка завершена

                </div>

                <h2
                    className="
                    text-5xl
                    md:text-6xl
                    font-black
                    leading-[1]
                    mb-6
                    "
                >

                    РЕЙТИНГ
                    <br />
                    РАЗБЛОКИРОВАН

                </h2>

                <div
                    className="
                    text-xl
                    text-emerald-100/70
                    max-w-[900px]
                    leading-relaxed
                    mb-10
                    "
                >

                    Competitive рейтинг открыт.
                    Теперь твой профиль участвует
                    в полноценной рейтинговой системе
                    и отображается в таблице лидеров.

                </div>

                <div
                    className="
                    flex
                    flex-wrap
                    gap-4
                    "
                >

                    <div
                    className="
                        px-6
                        py-4

                        rounded-2xl

                        bg-black/30

                        border
                        border-emerald-500/20
                    "
                    >

                    <div
                        className="
                        text-sm
                        text-emerald-300/70
                        uppercase
                        tracking-[0.25em]
                        mb-2
                        "
                    >

                        ТЕКУЩИЙ РАНГ
                    </div>

                    <div
                        className="
                        text-3xl
                        font-black
                        text-white
                        "
                    >

                        {translateRank(player?.rank)}

                    </div>

                    </div>

                    <div
                    className="
                        px-6
                        py-4

                        rounded-2xl

                        bg-black/30

                        border
                        border-cyan-500/20
                    "
                    >

                    <div
                        className="
                        text-sm
                        text-cyan-300/70
                        uppercase
                        tracking-[0.25em]
                        mb-2
                        "
                    >

                        ТЕКУЩИЙ ELO
                    </div>

                    <div
                        className="
                        text-3xl
                        font-black
                        text-cyan-400
                        "
                    >

                        {player.elo}

                    </div>

                    </div>

                </div>

                </div>

            </div>

            </section>

        )
        }
        

        
    
        {/* RULES */}

        <section className="mb-14">

          <div
            className="
              uppercase
              tracking-[0.3em]
              text-orange-400
              text-sm
              mb-4
            "
          >

            Ruleset

          </div>

          <h2
            className="
              text-5xl
              font-black
              mb-10
            "
          >

            Правила калибровки

          </h2>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-5
            "
          >

            <RuleCard
              title="5 матчей"
              value="BO1"
              description="Каждый игрок проходит 5 Калибровочных матчей (1 карта = 1 матч)"
            />

            <RuleCard
              title="First To"
              value="10"
              description="В матче(карте) Побеждает игрок, первым набравший 10 раундов"
            />

            <RuleCard
              title="Формат"
              value="1x1"
              description="Соревновательный DUEL формат"
            />

            <RuleCard
              title="Тип"
              value="Калибровка"
              description="Калибровочный (Placement matchmaking)"
            />

          </div>

        </section>

        {/* MAP POOL */}

        <section className="mb-14">

          <div
            className="
              uppercase
              tracking-[0.3em]
              text-cyan-400
              text-sm
              mb-4
            "
          >

            Competitive Maps

          </div>

          <h2
            className="
              text-5xl
              font-black
              mb-10
            "
          >

            Карты калибровки

          </h2>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-5
              gap-5
            "
          >

            {[
              "aim_sk_ak_m4",
              "awp_map",
              "$2000$",
              "de_dust2",
              "cs_mansion"
            ].map((map) => (

              <div
                key={map}
                className="
                  relative
                  overflow-hidden

                  rounded-3xl

                  border
                  border-slate-800

                  bg-slate-900

                  p-8

                  hover:border-orange-500/30

                  transition-all
                  duration-300
                "
              >

                <div
                  className="
                    absolute
                    top-[-50px]
                    right-[-50px]

                    text-[120px]

                    opacity-5

                    font-black
                  "
                >

                  MAP

                </div>

                <div className="relative z-10">

                  <div
                    className="
                      text-orange-400
                      uppercase
                      tracking-[0.25em]
                      text-xs
                      mb-4
                    "
                  >

                    COMPETITIVE

                  </div>

                  <div
                    className="
                      text-2xl
                      font-black
                      break-all
                    "
                  >

                    {map}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* VETO */}

        <section className="mb-14">

          <div
            className="
              rounded-[40px]

              border
              border-yellow-500/20

              bg-gradient-to-br
              from-yellow-500/10
              to-transparent

              p-10
            "
          >

            <div
              className="
                uppercase
                tracking-[0.3em]
                text-yellow-400
                text-sm
                mb-4
              "
            >

              Map Veto

            </div>

            <h2
              className="
                text-5xl
                font-black
                mb-8
              "
            >

              Система банов

            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-5
                gap-6
              "
            >

              <VetoStep
                number="01"
                title="Игрок 1"
                description="Банит 1-ю карту"
              />

              <VetoStep
                number="02"
                title="Игрок 2"
                description="Банит 2-ю карту"
              />

              <VetoStep
                number="03"
                title="Игрок 1"
                description="Банит 3-ю карту"
              />

              <VetoStep
                number="04"
                title="Игрок 2"
                description="Банит 4-ю карту"
              />

              <VetoStep
                number="05"
                title="Финальная карта"
                description="Оставшаяся карта играется"
              />

            </div>

          </div>

        </section>

        {/* RANKS */}

        <section className="mb-14">

          <div
            className="
              uppercase
              tracking-[0.3em]
              text-purple-400
              text-sm
              mb-4
            "
          >

            Competitive Progression

          </div>

          <h2
            className="
              text-5xl
              font-black
              mb-10
            "
          >

            Competitive Ranks

          </h2>

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              xl:grid-cols-6
              gap-5
            "
          >

            {[
              "Бронза",
              "Серебро",
              "Золото",
              "Платина",
              "Алмаз",
              "Элита"
            ].map((rank) => (

              <div
                key={rank}
                className="
                  rounded-3xl

                  border
                  border-slate-800

                  bg-slate-900

                  p-8

                  text-center

                  hover:border-orange-500/30

                  transition-all
                  duration-300
                "
              >

                <div
                  className="
                    text-5xl
                    mb-5
                  "
                >

                  🏆

                </div>

                <div
                  className="
                    text-2xl
                    font-black
                  "
                >

                  {rank}

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* CTA */}

        <section>

          <div
            className="
              rounded-[40px]

              border
              border-orange-500/20

              bg-gradient-to-br
              from-orange-500/10
              to-transparent

              p-12

              text-center
            "
          >

            <div
              className="
                uppercase
                tracking-[0.3em]
                text-orange-400
                text-sm
                mb-4
              "
            >

              Competitive Queue

            </div>

            <h2
              className="
                text-5xl
                font-black
                mb-6
              "
            >

              Начни калибровку

            </h2>

            <div
              className="
                text-gray-400
                text-xl
                max-w-[800px]
                mx-auto
                mb-10
              "
            >

              Пройди Калибровочные матчи,
              открой свой скрытый рейтинг
              и войди в Таблицу рейтинга игроков.

            </div>

            
            {
            player?.is_placement

                ? (

                <button
                    onClick={findPlacementMatch}

                    disabled={searching}

                    className="
                    inline-flex
                    items-center
                    justify-center

                    px-10
                    py-5

                    rounded-3xl

                    bg-orange-500
                    hover:bg-orange-400

                    disabled:opacity-50
                    disabled:cursor-not-allowed

                    transition-all
                    duration-300

                    text-xl
                    font-black

                    shadow-[0_0_40px_rgba(249,115,22,0.25)]
                    "
                >

                    {
                    searching

                        ? "ПОИСК СОПЕРНИКА..."

                        : "НАЙТИ PLACEMENT МАТЧ"
                    }

                </button>

                )

                : (

                <Link
                    to={player ? `/players/${player.id}` : "/login"}

                    className="
                    inline-flex
                    items-center
                    justify-center

                    px-10
                    py-5

                    rounded-3xl

                    bg-emerald-500
                    hover:bg-emerald-400

                    transition-all
                    duration-300

                    text-xl
                    font-black

                    shadow-[0_0_40px_rgba(16,185,129,0.25)]
                    "
                >

                    ОТКРЫТЬ COMPETITIVE PROFILE

                </Link>

                )
            }
            


          </div>

        </section>

      </div>

    </div>

  )
}

function RuleCard({
  title,
  value,
  description
}) {

  return (

    <div
      className="
        rounded-3xl

        border
        border-slate-800

        bg-slate-900

        p-8
      "
    >

      <div
        className="
          text-gray-400
          uppercase
          tracking-[0.25em]
          text-xs
          mb-4
        "
      >

        {title}

      </div>

      <div
        className="
          text-5xl
          font-black
          text-orange-400
          mb-5
        "
      >

        {value}

      </div>

      <div className="text-gray-400">

        {description}

      </div>

    </div>

  )
}

function VetoStep({
  number,
  title,
  description
}) {

  return (

    <div
      className="
        rounded-3xl

        border
        border-yellow-500/20

        bg-black/20

        p-8
      "
    >

      <div
        className="
          text-yellow-400
          text-5xl
          font-black
          mb-5
        "
      >

        {number}

      </div>

      <div
        className="
          text-2xl
          font-black
          mb-3
        "
      >

        {title}

      </div>

      <div className="text-yellow-100/70">

        {description}

      </div>

    </div>

  )
}


function PlacementStat({
  title,
  value,
  color
}) {

  return (

    <div
      className="
        rounded-3xl

        border
        border-slate-800

        bg-slate-900

        p-6
      "
    >

      <div
        className="
          uppercase
          tracking-[0.25em]
          text-gray-500
          text-xs
          mb-3
        "
      >

        {title}

      </div>

      <div
        className={`
          text-4xl
          font-black

          ${color}
        `}
      >

        {value}

      </div>

    </div>

  )
}

