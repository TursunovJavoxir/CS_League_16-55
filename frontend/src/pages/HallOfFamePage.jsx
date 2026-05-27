import {
  useEffect,
  useMemo,
  useState
} from "react"

import { apiFetch } from "../utils/api"
import { Link } from "react-router-dom"

import { translateRank } from "../utils/translations"

import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"
import EmptyState from "../components/ui/EmptyState"
import ErrorState from "../components/ui/ErrorState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"

export default function HallOfFamePage() {

  const [champions, setChampions] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const loadChampions = async () => {

    try {

      setLoading(true)

      setError("")

      const response = await apiFetch(
        "/seasons/hall-of-fame"
      )

      if (!response.ok) {

        throw new Error(
          "Ошибка загрузки «Зал Славы»"
        )

      }

      const data = await response.json()

      setChampions(
        Array.isArray(data)
          ? data
          : []
      )

    } catch (err) {

      setError(
        err.message ||
        "Ошибка загрузки «Зал Славы»"
      )

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    loadChampions()

  }, [])

  const highestElo = useMemo(() => {

    if (!champions.length) return 0

    return Math.max(
      ...champions.map(
        c => c.champion_elo || 0
      )
    )

  }, [champions])

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white

      px-4
      py-8

      md:px-8
      xl:px-12
    ">

      <div className="mx-auto max-w-7xl">

        <PageHeader
          title="«Зал Славы»"
          subtitle="Легендарные чемпионы сезонов CS League"
        />

        {/* STATS */}

        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
          mb-8
        ">

          <Card
            className="p-5"
            hover={false}
          >

            <div className="text-sm text-slate-500">
              Чемпионов
            </div>

            <div className="text-3xl font-black">
              {champions.length}
            </div>

          </Card>

          <Card
            className="p-5"
            hover={false}
          >

            <div className="text-sm text-slate-500">
              Лучший ELO
            </div>

            <div className="
              text-3xl
              font-black
              text-orange-400
            ">
              {highestElo}
            </div>

          </Card>

          <Card
            className="p-5"
            hover={false}
          >

            <div className="text-sm text-slate-500">
              Статус
            </div>

            <div className="
              text-3xl
              font-black
              text-emerald-400
            ">
              LIVE
            </div>

          </Card>

          <Card
            className="p-5"
            hover={false}
          >

            <div className="text-sm text-slate-500">
              Архив
            </div>

            <div className="
              text-3xl
              font-black
              text-cyan-300
            ">
              LEGENDS
            </div>

          </Card>

        </div>

        {/* LOADING */}

        {
          loading && (
            <LoadingState
              text="Загрузка чемпионов..."
            />
          )
        }

        {/* ERROR */}

        {
          !loading &&
          error && (
            <ErrorState
              title="Ошибка загрузки"
              description={error}
            />
          )
        }

        {/* EMPTY */}

        {
          !loading &&
          !error &&
          champions.length === 0 && (
            <EmptyState
              title="«Зал Славы» пуст"
              description="После завершения сезонов здесь появятся чемпионы."
            />
          )
        }

        {/* CHAMPIONS */}

        {
          !loading &&
          !error &&
          champions.length > 0 && (

            <div className="grid gap-6">

              {
                champions.map(
                  (champion, index) => (

                    <Link
                      key={champion.season_id}
                      to={`/players/${champion.champion_id}`}
                    >

                      <Card
                        glow
                        className="
                          p-8
                          overflow-hidden
                        "
                      >

                        {/* BACKGROUND */}

                        <div
                          className="
                            absolute
                            top-[-120px]
                            right-[-120px]

                            w-[320px]
                            h-[320px]

                            rounded-full

                            bg-orange-500/10

                            blur-[140px]
                          "
                        />

                        <div
                          className="
                            relative
                            z-10

                            flex
                            flex-col
                            xl:flex-row

                            xl:items-center
                            xl:justify-between

                            gap-8
                          "
                        >

                          {/* LEFT */}

                          <div>

                            <div className="
                              flex
                              flex-wrap
                              items-center
                              gap-3
                              mb-5
                            ">

                              <Badge
                                variant="orange"
                              >
                                #{index + 1} LEGEND
                              </Badge>

                              <Badge>
                                {champion.season_name}
                              </Badge>

                            </div>

                            <div className="
                              text-5xl
                              md:text-6xl
                              font-black
                              mb-5
                              leading-tight
                            ">

                              👑 {champion.champion_name}

                            </div>

                            <div className="
                              flex
                              flex-wrap
                              gap-4
                            ">

                              <Badge
                                variant="green"
                                size="lg"
                              >

                                {champion.champion_elo} ELO

                              </Badge>

                              <Badge
                                variant="blue"
                                size="lg"
                              >

                                {
                                  translateRank(
                                    champion.champion_rank
                                  )
                                }

                              </Badge>

                            </div>

                          </div>

                          {/* RIGHT */}

                          <div
                            className="
                              xl:text-right
                            "
                          >

                            <div className="
                              text-sm
                              uppercase
                              tracking-[0.3em]
                              text-slate-500
                              mb-3
                            ">

                              Champion Archive

                            </div>

                            <div className="
                              text-7xl
                              font-black
                              text-orange-400
                            ">

                              🏆

                            </div>

                          </div>

                        </div>

                      </Card>

                    </Link>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>
  )
}