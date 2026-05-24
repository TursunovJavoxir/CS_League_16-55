import { useEffect, useState } from "react"
import { apiFetch } from "../utils/api"

export default function TournamentParticipantsManager() {

  const [tournaments, setTournaments] = useState([])

  const [players, setPlayers] = useState([])

  const [selectedTournament, setSelectedTournament] = useState("")

  const [selectedPlayers, setSelectedPlayers] = useState([])

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const [adding, setAdding] = useState(false)

  useEffect(() => {

    apiFetch("/tournaments")
      .then(res => res.json())
      .then(data => {
        setTournaments(data)
      })

    apiFetch("/players")
      .then(res => res.json())
      .then(data => {
        setPlayers(data)
      })

  }, [])

  const togglePlayer = (playerId) => {

    setSelectedPlayers(prev => {

      if (prev.includes(playerId)) {

        return prev.filter(id => id !== playerId)

      }

      return [...prev, playerId]

    })

  }

  const handleAddPlayers = async () => {

    setMessage("")
    setError("")

    if (!selectedTournament) {

      setError("Выберите турнир")

      return

    }

    if (selectedPlayers.length === 0) {

      setError("Выберите хотя бы одного игрока")

      return

    }

    try {

      setAdding(true)

      for (const playerId of selectedPlayers) {

        const response = await apiFetch(
          `/tournaments/${selectedTournament}/players/${playerId}`,
          {
            method: "POST"
          }
        )

        const data = await response.json()

        if (!response.ok) {

          throw new Error(
            data.detail ||
            "Ошибка добавления игрока"
          )

        }

      }

      setMessage(
        `Добавлено игроков: ${selectedPlayers.length}`
      )

      setSelectedPlayers([])

    } catch (err) {

      setError(
        err.message ||
        "Ошибка сервера"
      )

    } finally {

      setAdding(false)

    }

  }

  const handleAddAllPlayers = async () => {

    setMessage("")
    setError("")

    if (!selectedTournament) {

      setError("Выберите турнир")

      return

    }

    try {

      const response = await apiFetch(
        `/tournaments/${selectedTournament}/add-all-players`,
        {
          method: "POST"
        }
      )

      const data = await response.json()

      if (!response.ok) {

        setError(data.detail || "Ошибка")

        return

      }

      setMessage(data.message)

    } catch {

      setError("Ошибка сервера")

    }

  }

  return (
    <div
      className="
        bg-slate-800
        rounded-2xl
        p-8
        border
        border-slate-700
      "
    >

      <h2 className="text-3xl font-bold mb-8">

        Участники турнира

      </h2>

      <div className="space-y-6">

        {/* TOURNAMENT */}

        <div>

          <label className="block text-gray-300 mb-2">

            Турнир

          </label>

          <select
            value={selectedTournament}
            onChange={(e) =>
              setSelectedTournament(e.target.value)
            }
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

        {/* PLAYERS */}

        <div>

          <div className="flex items-center justify-between mb-3">

            <label className="text-gray-300">

              Игроки

            </label>

            <div className="text-sm text-orange-400 font-bold">

              Выбрано:
              {" "}
              {selectedPlayers.length}

            </div>

          </div>

          <div
            className="
              max-h-[320px]
              overflow-y-auto

              bg-slate-900
              border
              border-slate-700

              rounded-2xl

              p-3

              space-y-2
            "
          >

            {players.map((player) => {

              const selected =
                selectedPlayers.includes(player.id)

              return (

                <button
                  key={player.id}
                  type="button"
                  onClick={() =>
                    togglePlayer(player.id)
                  }
                  className={`
                    w-full

                    flex
                    items-center
                    justify-between

                    rounded-xl

                    px-4
                    py-3

                    border

                    transition-all
                    duration-200

                    ${
                      selected
                        ? `
                          bg-orange-500/20
                          border-orange-500/40
                          text-orange-300
                        `
                        : `
                          bg-slate-800
                          border-slate-700
                          hover:border-orange-500/30
                          text-white
                        `
                    }
                  `}
                >

                  <div className="font-bold">

                    {player.nickname}

                  </div>

                  <div
                    className="
                      text-sm
                      text-slate-400
                    "
                  >

                    {player.rank}

                  </div>

                </button>

              )

            })}

          </div>

        </div>

        {/* SUCCESS */}

        {message && (

          <div
            className="
              bg-green-500/20
              text-green-400
              p-3
              rounded-xl
            "
          >

            {message}

          </div>

        )}

        {/* ERROR */}

        {error && (

          <div
            className="
              bg-red-500/20
              text-red-400
              p-3
              rounded-xl
            "
          >

            {error}

          </div>

        )}

        {/* ACTIONS */}

        <div className="flex gap-4 flex-wrap">

          <button
            onClick={handleAddPlayers}
            disabled={adding}
            className="
              bg-orange-500
              hover:bg-orange-600

              disabled:opacity-50

              transition

              px-6
              py-3

              rounded-xl

              font-bold
            "
          >

            {
              adding
                ? "Добавление..."
                : `Добавить выбранных (${selectedPlayers.length})`
            }

          </button>

          <button
            onClick={handleAddAllPlayers}
            className="
              bg-purple-600
              hover:bg-purple-700

              transition

              px-6
              py-3

              rounded-xl

              font-bold
            "
          >

            Добавить всех игроков

          </button>

        </div>

      </div>

    </div>
  )
}