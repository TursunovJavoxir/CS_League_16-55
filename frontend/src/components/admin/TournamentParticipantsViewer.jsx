import { useEffect, useState } from "react"
import { apiFetch } from "../../utils/api"

export default function TournamentParticipantsViewer() {
  const [tournaments, setTournaments] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedTournament, setSelectedTournament] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    apiFetch("/tournaments")
      .then(res => res.json())
      .then(data => {
        setTournaments(Array.isArray(data) ? data : [])
      })
  }, [])

  const loadParticipants = async (tournamentId) => {
    setSelectedTournament(tournamentId)
    setPlayers([])
    setError("")

    if (!tournamentId) return

    try {
      setLoading(true)

      const response = await apiFetch(
        `/tournaments/${tournamentId}/players`
      )

      if (!response.ok) {
        throw new Error("Ошибка загрузки участников")
      }

      const data = await response.json()

      setPlayers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || "Ошибка загрузки участников")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <h2 className="text-3xl font-bold mb-8">
        Просмотр участников
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">
            Турнир
          </label>

          <select
            value={selectedTournament}
            onChange={(e) => loadParticipants(e.target.value)}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
            "
          >
            <option value="">
              Выберите турнир
            </option>

            {tournaments.map((tournament) => (
              <option
                key={tournament.id}
                value={tournament.id}
              >
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="text-slate-400">
            Загрузка участников...
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-xl">
            {error}
          </div>
        )}

        {!loading && !error && selectedTournament && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="text-slate-400">
                Участников
              </div>

              <div className="text-3xl font-black text-orange-400">
                {players.length}
              </div>
            </div>

            {players.length === 0 ? (
              <div className="text-slate-500">
                В этом турнире пока нет участников.
              </div>
            ) : (
              <div className="space-y-3 max-h-[340px] overflow-y-auto">
                {players.map((player, index) => (
                  <div
                    key={player.id || index}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-800
                      px-4
                      py-3
                    "
                  >
                    <div>
                      <div className="font-black text-white">
                        {index + 1}. {player.nickname}
                      </div>

                      <div className="text-sm text-slate-400">
                        {player.rank || "Без ранга"}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-emerald-400 font-black">
                        {player.elo ?? "—"} ELO
                      </div>

                      <div className="text-xs text-slate-500">
                        ID: {player.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}