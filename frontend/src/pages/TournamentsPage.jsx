import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { apiFetch } from "../utils/api"
import { translateStatus } from "../utils/translations"

import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"
import EmptyState from "../components/ui/EmptyState"
import ErrorState from "../components/ui/ErrorState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"

const getStatusVariant = (status) => {
  if (status === "active") return "orange"
  if (status === "finished") return "green"

  return "default"
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch("/tournaments")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка загрузки турниров")
        }

        return res.json()
      })
      .then((data) => {
        setTournaments(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.message || "Ошибка загрузки турниров")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const activeCount = tournaments.filter(
    (tournament) =>
      tournament.status === "active" ||
      tournament.status === "upcoming"
  ).length

  const finishedCount = tournaments.filter(
    (tournament) => tournament.status === "finished"
  ).length

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-7xl">

        <PageHeader
          title="Турниры"
          subtitle="Competitive CS League Events"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
          <Card className="p-5" hover={false}>
            <div className="text-sm text-slate-500">Всего турниров</div>
            <div className="text-3xl font-black">
              {tournaments.length}
            </div>
          </Card>

          <Card className="p-5" hover={false}>
            <div className="text-sm text-slate-500">Активные</div>
            <div className="text-3xl font-black text-orange-400">
              {activeCount}
            </div>
          </Card>

          <Card className="p-5" hover={false}>
            <div className="text-sm text-slate-500">Завершённые</div>
            <div className="text-3xl font-black text-emerald-400">
              {finishedCount}
            </div>
          </Card>
        </div>

        {loading && (
          <LoadingState text="Загрузка турниров..." />
        )}

        {!loading && error && (
          <ErrorState
            title="Ошибка загрузки"
            description={error}
          />
        )}

        {!loading && !error && tournaments.length === 0 && (
          <EmptyState
            title="Турниров пока нет"
            description="Создайте первый турнир через админ панель."
          />
        )}

        {!loading && !error && tournaments.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                to={`/tournaments/${tournament.id}`}
              >
                <Card glow className="p-7 h-full">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight mb-2">
                        {tournament.name}
                      </h2>

                      <p className="text-slate-400">
                        CS League Championship
                      </p>
                    </div>

                    <Badge variant={getStatusVariant(tournament.status)}>
                      {translateStatus(tournament.status)}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-800/40 px-4 py-3">
                      <span className="text-slate-400">
                        Сезон
                      </span>

                      <span className="font-bold text-white">
                        {tournament.season || tournament.season_name || tournament.season_id || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-800/40 px-4 py-3">
                      <span className="text-slate-400">
                        Победитель
                      </span>

                      <span className="font-black text-orange-400">
                        {tournament.winner || "TBD"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
                    <span className="text-sm text-slate-500">
                      Tournament ID #{tournament.id}
                    </span>

                    <span className="font-black text-orange-400">
                      OPEN →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}