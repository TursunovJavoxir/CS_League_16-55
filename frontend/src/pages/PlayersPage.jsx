import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { translateRank } from "../utils/translations"
import { apiFetch } from "../utils/api"
import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"
import EmptyState from "../components/ui/EmptyState"
import ErrorState from "../components/ui/ErrorState"
import LoadingState from "../components/ui/LoadingState"
import PageHeader from "../components/ui/PageHeader"

const getRankVariant = (rank = "") => {
  const normalizedRank = rank.toLowerCase()

  if (normalizedRank.includes("legend")) return "yellow"
  if (normalizedRank.includes("global")) return "orange"
  if (normalizedRank.includes("diamond")) return "blue"
  if (normalizedRank.includes("gold")) return "yellow"
  if (normalizedRank.includes("placement")) return "purple"

  return "default"
}

const getWinrateColor = (winrate = 0) => {
  if (winrate >= 70) return "text-emerald-400"
  if (winrate >= 50) return "text-cyan-300"
  if (winrate >= 35) return "text-yellow-300"

  return "text-rose-300"
}

export default function PlayersPage() {
  const [players, setPlayers] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("elo")
  const [rankFilter, setRankFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    const loadPlayers = async () => {
      try {
        setIsLoading(true)
        setError("")

        const response = await apiFetch("/players")

        if (!response.ok) {
          throw new Error("Не удалось загрузить список игроков")
        }

        const data = await response.json()

        if (isMounted) {
          setPlayers(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Ошибка загрузки игроков")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadPlayers()

    return () => {
      isMounted = false
    }
  }, [])

  const ranks = useMemo(() => {
    return Array.from(
      new Set(
        players
          .map((player) => player.rank)
          .filter(Boolean)
      )
    )
  }, [players])

  const filteredPlayers = useMemo(() => {
    return players
      .filter((player) => {
        const matchesSearch = player.nickname
          ?.toLowerCase()
          .includes(search.toLowerCase())

        const matchesRank =
          rankFilter === "all" || player.rank === rankFilter

        return matchesSearch && matchesRank
      })
      .sort((a, b) => {
        if (sortBy === "winrate") {
          return (b.winrate || 0) - (a.winrate || 0)
        }

        if (sortBy === "matches") {
          return (b.matches_played || 0) - (a.matches_played || 0)
        }

        if (sortBy === "streak") {
          return (b.streak || 0) - (a.streak || 0)
        }

        return (b.elo || 0) - (a.elo || 0)
      })
  }, [players, search, rankFilter, sortBy])

  const totalMatches = players.reduce(
    (sum, player) => sum + (player.matches_played || 0),
    0
  )

  const averageElo = players.length
    ? Math.round(
        players.reduce(
          (sum, player) => sum + (player.elo || 0),
          0
        ) / players.length
      )
    : 0

  const topPlayer = players[0]

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-7xl">

        <PageHeader
          title="Игроки лиги"
          subtitle="Премиальный список участников с ELO, рангами, винрейтом и текущей формой игрока."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          <Card className="p-5" hover={false}>
            <div className="text-sm text-slate-500">Всего игроков</div>
            <div className="text-3xl font-black">{players.length}</div>
          </Card>

          <Card className="p-5" hover={false}>
            <div className="text-sm text-slate-500">Средний ELO</div>
            <div className="text-3xl font-black text-cyan-300">
              {averageElo}
            </div>
          </Card>

          <Card className="p-5" hover={false}>
            <div className="text-sm text-slate-500">Всего матчей</div>
            <div className="text-3xl font-black text-emerald-300">
              {totalMatches}
            </div>
          </Card>

          <Card className="p-5" hover={false}>
            <div className="text-sm text-slate-500">Топ игрок</div>
            <div className="truncate text-xl font-black text-orange-300">
              {topPlayer?.nickname || "—"}
            </div>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <input
            type="text"
            placeholder="Поиск по nickname..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="
              rounded-2xl
              border border-slate-800
              bg-slate-900
              px-5 py-4
              outline-none
              transition
              placeholder:text-slate-500
              focus:border-orange-500
            "
          />

          <select
            value={rankFilter}
            onChange={(event) => setRankFilter(event.target.value)}
            className="
              rounded-2xl
              border border-slate-800
              bg-slate-900
              px-5 py-4
              outline-none
              transition
              focus:border-orange-500
            "
          >
            <option value="all">Все ранги</option>
            {ranks.map((rank) => (
              <option key={rank} value={rank}>
                {translateRank(rank)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="
              rounded-2xl
              border border-slate-800
              bg-slate-900
              px-5 py-4
              outline-none
              transition
              focus:border-orange-500
            "
          >
            <option value="elo">Сортировка: ELO</option>
            <option value="winrate">Сортировка: Winrate</option>
            <option value="matches">Сортировка: Матчи</option>
            <option value="streak">Сортировка: Streak</option>
          </select>
        </div>

        {isLoading && (
          <LoadingState text="Загрузка игроков..." />
        )}

        {!isLoading && error && (
          <ErrorState
            title="Backend недоступен"
            description={error}
          />
        )}

        {!isLoading && !error && filteredPlayers.length === 0 && (
          <EmptyState
            title="Игроки не найдены"
            description="Попробуй изменить поиск, фильтр ранга или сортировку."
          />
        )}

        {!isLoading && !error && filteredPlayers.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPlayers.map((player, index) => {
              const winrate = Math.round(player.winrate || 0)

              return (
                <Link
                  key={player.id}
                  to={`/players/${player.id}`}
                >
                  <Card glow className="p-5 h-full">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="
                          flex h-14 w-14 items-center justify-center
                          rounded-2xl
                          border border-orange-500/30
                          bg-gradient-to-br from-orange-500/20 to-slate-950
                          text-xl font-black text-orange-300
                        ">
                          {player.nickname?.slice(0, 2).toUpperCase() || "P"}
                        </div>

                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-sm font-black text-slate-500">
                              #{player.position || index + 1}
                            </span>

                            {player.is_placement && (
                              <Badge variant="purple" size="sm">
                                CALIBRATION
                              </Badge>
                            )}
                          </div>

                          <h2 className="
                            text-2xl font-black tracking-tight
                            transition
                            group-hover:text-orange-300
                          ">
                            {player.nickname}
                          </h2>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-black text-emerald-300">
                          {player.elo ?? "—"}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          ELO
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <Badge variant={getRankVariant(player.rank)}>
                        {translateRank(player.rank)}
                      </Badge>
                    </div>

                    <div className="mb-5 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                        <div className="text-xs text-slate-500">Wins</div>
                        <div className="text-xl font-black text-emerald-300">
                          {player.wins || 0}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                        <div className="text-xs text-slate-500">Losses</div>
                        <div className="text-xl font-black text-rose-300">
                          {player.losses || 0}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                        <div className="text-xs text-slate-500">Streak</div>
                        <div className="text-xl font-black text-yellow-300">
                          {player.streak || 0}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-500">Winrate</span>
                          <span className={`font-black ${getWinrateColor(winrate)}`}>
                            {winrate}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-400"
                            style={{ width: `${Math.min(winrate, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-sm text-slate-400">
                        <span>{player.matches_played || 0} матчей</span>
                        <span>
                          Peak ELO: {player.peak_elo || player.elo || "—"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}