import { useEffect, useMemo, useState } from "react"
import { apiFetch } from "../../utils/api"

export default function TournamentQuickStats() {
  const [tournaments, setTournaments] = useState([])
  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const loadStats = async () => {
      try {
        setError("")

        const [
          tournamentsRes,
          playersRes,
          matchesRes
        ] = await Promise.all([
          apiFetch("/tournaments"),
          apiFetch("/players"),
          apiFetch("/matches")
        ])

        if (!tournamentsRes.ok || !playersRes.ok || !matchesRes.ok) {
          throw new Error("Ошибка загрузки статистики")
        }

        const tournamentsData = await tournamentsRes.json()
        const playersData = await playersRes.json()
        const matchesData = await matchesRes.json()

        setTournaments(Array.isArray(tournamentsData) ? tournamentsData : [])
        setPlayers(Array.isArray(playersData) ? playersData : [])
        setMatches(Array.isArray(matchesData) ? matchesData : [])
      } catch (err) {
        setError(err.message || "Ошибка загрузки статистики")
      }
    }

    loadStats()
  }, [])

  const availableTournaments = tournaments.filter(
    (tournament) =>
      tournament.status === "active" ||
      tournament.status === "upcoming"
  ).length

  const finishedTournaments = tournaments.filter(
    (tournament) => tournament.status === "finished"
  ).length

  const pendingMatches = matches.filter(
    (match) => !match.winner
  ).length

  const averageElo = useMemo(() => {
    if (!players.length) return 0

    return Math.round(
      players.reduce(
        (sum, player) => sum + (player.elo || 0),
        0
      ) / players.length
    )
  }, [players])

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-3xl font-bold mb-8">
        Быстрая статистика
      </h2>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatBox
          title="Турниров"
          value={tournaments.length}
          color="text-orange-400"
        />

        <StatBox
          title="Доступные"
          value={availableTournaments}
          color="text-cyan-400"
        />

        <StatBox
          title="Завершённые"
          value={finishedTournaments}
          color="text-emerald-400"
        />

        <StatBox
          title="Игроков"
          value={players.length}
          color="text-purple-400"
        />

        <StatBox
          title="Матчей"
          value={matches.length}
          color="text-yellow-300"
        />

        <StatBox
          title="Ожидают"
          value={pendingMatches}
          color="text-red-300"
        />

        <StatBox
          title="Средний ELO"
          value={averageElo}
          color="text-green-400"
        />
      </div>
    </div>
  )
}

function StatBox({
  title,
  value,
  color
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <div className="text-slate-400 text-sm mb-2">
        {title}
      </div>

      <div className={`text-3xl font-black ${color}`}>
        {value}
      </div>
    </div>
  )
}