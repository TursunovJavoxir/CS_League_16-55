import { useEffect, useState } from "react"
import { apiFetch } from "../../utils/api"

export default function SeasonAdminPanel() {
  const [seasons, setSeasons] = useState([])
  const [players, setPlayers] = useState([])
  const [activeSeason, setActiveSeason] = useState(null)

  const [newSeasonName, setNewSeasonName] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState("")

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    try {
      setError("")

      const [seasonsRes, playersRes, activeRes] = await Promise.all([
        apiFetch("/seasons"),
        apiFetch("/players"),
        apiFetch("/seasons/active")
      ])

      const seasonsData = await seasonsRes.json()
      const playersData = await playersRes.json()
      const activeData = activeRes.ok ? await activeRes.json() : null

      setSeasons(Array.isArray(seasonsData) ? seasonsData : [])
      setPlayers(Array.isArray(playersData) ? playersData : [])
      setActiveSeason(activeData)
    } catch {
      setError("Ошибка загрузки сезонов")
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const execute = async (requestFn, successText) => {
    try {
      setLoading(true)
      setMessage("")
      setError("")

      const res = await requestFn()
      const data = await res.json()

      if (!res.ok) {
        setError(data.detail || "Ошибка выполнения действия")
        return
      }

      setMessage(data.message || successText)
      loadData()
    } catch {
      setError("Ошибка сервера")
    } finally {
      setLoading(false)
    }
  }

  const createSeason = () => {
    if (!newSeasonName.trim()) {
      setError("Введите название сезона")
      return
    }

    execute(
      () => apiFetch(`/seasons/create?name=${encodeURIComponent(newSeasonName)}`, {
        method: "POST"
      }),
      "Сезон создан"
    )

    setNewSeasonName("")
  }

  const activateSeason = () => {
    if (!selectedSeason) {
      setError("Выберите сезон")
      return
    }

    execute(
      () => apiFetch(`/seasons/${selectedSeason}/activate`, {
        method: "POST"
      }),
      "Сезон активирован"
    )
  }

  const softReset = () => {
    execute(
      () => apiFetch("/seasons/soft-reset", {
        method: "POST"
      }),
      "Soft reset выполнен"
    )
  }

  const setChampion = () => {
    if (!selectedSeason || !selectedPlayer) {
      setError("Выберите сезон и игрока")
      return
    }

    execute(
      () => apiFetch(`/seasons/${selectedSeason}/set-champion/${selectedPlayer}`, {
        method: "POST"
      }),
      "Чемпион сезона установлен"
    )
  }

  const distributeRewards = () => {
    if (!selectedSeason) {
      setError("Выберите сезон")
      return
    }

    execute(
      () => apiFetch(`/seasons/${selectedSeason}/distribute-rewards`, {
        method: "POST"
      }),
      "Награды сезона выданы"
    )
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-3xl font-bold mb-8">
        Управление сезонами
      </h2>

      <div className="space-y-6">
        {activeSeason && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
            <div className="text-slate-400 mb-2">
              Активный сезон
            </div>

            <div className="text-3xl font-black text-green-400">
              {activeSeason.name}
            </div>
          </div>
        )}

        <div>
          <label className="block text-gray-300 mb-2">
            Новый сезон
          </label>

          <div className="flex gap-3">
            <input
              value={newSeasonName}
              onChange={(e) => setNewSeasonName(e.target.value)}
              placeholder="Например: Season 2"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
            />

            <button
              onClick={createSeason}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
            >
              Создать
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Сезон
          </label>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
          >
            <option value="">Выберите сезон</option>

            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Игрок для чемпиона
          </label>

          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none"
          >
            <option value="">Выберите игрока</option>

            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.nickname}
              </option>
            ))}
          </select>
        </div>

        {message && (
          <div className="bg-green-500/20 text-green-400 p-3 rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            onClick={activateSeason}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
          >
            Активировать сезон
          </button>

          <button
            onClick={setChampion}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
          >
            Установить чемпиона
          </button>

          <button
            onClick={distributeRewards}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
          >
            Выдать награды
          </button>

          <button
            onClick={softReset}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
          >
            Soft Reset
          </button>
        </div>
      </div>
    </div>
  )
}