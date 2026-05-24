import { useState } from "react"
import { apiFetch } from "../utils/api"

import {
  Link,
  useParams
} from "react-router-dom"

import { useAuth } from "../context/AuthContext"

import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import ErrorState from "../components/ui/ErrorState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"
import useLiveRefresh from "../hooks/useLiveRefresh"


export default function MatchVetoPage() {
  const { id } = useParams()
  const { currentPlayer } = useAuth()

  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadMatch = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await apiFetch(
        `/matches/${id}`
      )

      if (!response.ok) {
        throw new Error("Ошибка загрузки VETO системы")
      }

      const data = await response.json()

      setMatch(data)
    } catch (err) {
      setError(
        err.message ||
        "Ошибка загрузки VETO системы"
      )
    } finally {
      setLoading(false)
    }
  }

  useLiveRefresh(
    loadMatch,
    3000
  )

  const banMap = async (mapName) => {
    if (!currentPlayer) {
      alert("Сначала войдите в аккаунт")
      return
    }

    try {
      const response = await apiFetch(
        `/matches/${id}/ban-map` +
        `?player_id=${currentPlayer.id}` +
        `&map_name=${mapName}`,
        {
          method: "POST"
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.detail || "Ошибка бана карты")
        return
      }

      loadMatch()
    } catch {
      alert("Ошибка сервера")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <LoadingState text="Загрузка VETO системы..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <ErrorState
          title="Ошибка VETO"
          description={error}
        />
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <ErrorState
          title="Матч не найден"
          description="Матч не найден или данные VETO недоступны."
        />
      </div>
    )
  }

  const bannedMaps =
    Array.isArray(match.banned_maps)
      ? match.banned_maps
      : []

  const mapPool =
    Array.isArray(match.map_pool)
      ? match.map_pool
      : []

  const vetoCompleted =
    match.veto_completed === true ||
    match.veto_completed === "true"

  const isCurrentTurnPlayer =
    (
      match.veto_turn % 2 === 1 &&
      currentPlayer?.id === match.player1_id
    ) ||
    (
      match.veto_turn % 2 === 0 &&
      currentPlayer?.id === match.player2_id
    )

  const currentTurnName =
    match.veto_turn % 2 === 1
      ? match.player1
      : match.player2

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-6xl">

        <PageHeader
          title="VETO система"
          subtitle={`${match.player1} vs ${match.player2}`}
          rightContent={
            <Link to="/matches">
              <Button variant="secondary">
                ← Вернуться к матчам
              </Button>
            </Link>
          }
        />

        {!vetoCompleted && (
          <Card className="p-7 mb-8" glow>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <Badge variant={isCurrentTurnPlayer ? "orange" : "default"}>
                  {isCurrentTurnPlayer ? "Ваш ход" : "Ожидание соперника"}
                </Badge>

                <div className="mt-5 text-slate-400">
                  Сейчас банит
                </div>

                <div className="mt-2 text-4xl font-black text-orange-400">
                  {currentTurnName}
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  VETO TURN
                </div>

                <div className="mt-2 text-5xl font-black text-white">
                  #{match.veto_turn}
                </div>
              </div>
            </div>
          </Card>
        )}

        {vetoCompleted && (
          <Card className="p-7 mb-8 border-emerald-500/30" glow>
            <Badge variant="green">
              VETO завершено
            </Badge>

            <div className="mt-5 text-4xl font-black text-emerald-400">
              Финальная карта выбрана
            </div>
          </Card>
        )}

        <div className="mb-6">
          <h2 className="text-4xl font-black">
            Карты
          </h2>

          <p className="mt-2 text-slate-400">
            Игроки по очереди банят карты. Последняя оставшаяся карта становится финальной.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mapPool.map((map) => {
            const banned =
              bannedMaps.includes(map)

            return (
              <Card
                key={map}
                className={`
                  p-8
                  ${
                    banned
                      ? "opacity-45 border-red-500/30"
                      : ""
                  }
                `}
                glow={!banned}
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <Badge
                      variant={banned ? "red" : "blue"}
                      size="sm"
                    >
                      {banned ? "Забанена" : "Доступна"}
                    </Badge>

                    <div className="mt-5 text-3xl font-black break-all">
                      {map}
                    </div>

                    {!banned &&
                      !vetoCompleted &&
                      isCurrentTurnPlayer && (
                        <div className="mt-6">
                          <Button
                            variant="danger"
                            onClick={() => banMap(map)}
                          >
                            Забанить карту
                          </Button>
                        </div>
                      )}
                  </div>

                  <div className="text-5xl">
                    {banned ? "❌" : "🗺️"}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {match.selected_map && (
          <Card className="mt-10 p-10 text-center border-emerald-500/30" glow>
            <div className="uppercase tracking-[0.35em] text-emerald-400 text-sm mb-4">
              Финальная карта выбрана
            </div>

            <div className="text-6xl font-black text-white mb-4">
              {match.selected_map}
            </div>

            <div className="text-slate-400 text-xl">
              VETO завершено. Матч готов к запуску.
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}