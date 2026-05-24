import { useMemo, useState } from "react"


import { apiFetch } from "../utils/api"
import { useAuth } from "../context/AuthContext"
import useLiveRefresh from "../hooks/useLiveRefresh"

import MatchesStatsGrid from "../components/matches/MatchesStatsGrid"
import MatchCard from "../components/matches/MatchCard"
import EmptyState from "../components/ui/EmptyState"
import ErrorState from "../components/ui/ErrorState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { isAdmin } = useAuth()

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await apiFetch(
        "/matches"
      )

      if (!response.ok) {
        throw new Error("Ошибка загрузки матчей")
      }

      const data = await response.json()

      const sortedMatches = Array.isArray(data)
        ? data.sort((a, b) => {

            const aPending = !a.winner
            const bPending = !b.winner

            // pending сверху
            if (aPending && !bPending) return -1
            if (!aPending && bPending) return 1

            // новые выше старых
            return b.id - a.id
          })
        : []

      setMatches(sortedMatches)

    } catch (err) {
      setError(
        err.message || "Ошибка загрузки матчей"
      )
    } finally {
      setLoading(false)
    }
  }

  useLiveRefresh(
    loadMatches,
    30000
  )

  const finishMatch = async (
    match,
    winnerId
  ) => {
    if (!winnerId) return

    const score = prompt(
      "Введите счёт\n\nНапример: 2:1"
    )

    if (!score) return

    try {
      const res = await apiFetch(
        `/matches/${match.id}/finish` +
        `?winner_id=${winnerId}` +
        `&score=${score}`,
        {
          method: "POST"
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(
          data.detail ||
          "Ошибка завершения матча"
        )

        return
      }

      alert(
        `Матч завершён!\n\n` +
        `Победитель: ${data.winner}\n` +
        `ELO: ${data.elo_change}`
      )

      loadMatches()

    } catch (err) {
      console.error(err)
    }
  }

  const pendingCount = matches.filter(
    (match) => !match.winner
  ).length

  const finishedCount = matches.filter(
    (match) => match.winner
  ).length

  const totalEloChanges = useMemo(() => {
    return matches.reduce((sum, match) => {
      const value = Number(
        match.elo_change
          ?.split("/")[0]
      )

      return sum + (value || 0)
    }, 0)
  }, [matches])

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-7xl">

        <PageHeader
          title="Матчи"
          subtitle="История рейтинговых и турнирных игр CS League"
        />

        {/* STATS */}

        <MatchesStatsGrid
          totalMatches={matches.length}
          finishedCount={finishedCount}
          pendingCount={pendingCount}
          totalEloChanges={totalEloChanges}
        />

        {/* LOADING */}

        {loading && (
          <LoadingState text="Загрузка матчей..." />
        )}

        {/* ERROR */}

        {!loading && error && (
          <ErrorState
            title="Ошибка загрузки"
            description={error}
          />
        )}

        {/* EMPTY */}

        {!loading && !error && matches.length === 0 && (
          <EmptyState
            title="Матчей пока нет"
            description="После создания матчей они появятся здесь."
          />
        )}

        {/* MATCHES */}

        {!loading && !error && matches.length > 0 && (

          <div className="space-y-6">

            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                isAdmin={isAdmin}
                onFinishMatch={finishMatch}
              />
            ))}

          </div>

        )}

      </div>
    </div>
  )
}