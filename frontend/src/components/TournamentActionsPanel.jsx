import { useEffect, useState } from "react"
import { apiFetch } from "../utils/api"


export default function TournamentActionsPanel() {

  const [tournaments, setTournaments] = useState([])

  const [selectedTournament, setSelectedTournament] = useState("")

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  useEffect(() => {

    apiFetch("/tournaments")
      .then(res => res.json())
      .then(data => {

        setTournaments(data)

      })

  }, [])

  const executeAction = async (action) => {

    setMessage("")
    setError("")

    if (!selectedTournament) {

      setError("Выберите турнир")

      return

    }

    try {

      const response = await apiFetch(
        `/tournaments/${selectedTournament}/${action}`,
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

        Управление турниром

      </h2>

      <div className="space-y-6">

        <div>

          <label className="block text-gray-300 mb-2">

            Турнир

          </label>

          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
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
            onClick={() => executeAction("generate-bracket")}
            className="
              bg-orange-500
              hover:bg-orange-600
              transition
              px-5
              py-3
              rounded-xl
              font-bold
            "
          >

            Генерировать сетку

          </button>

          

          
        </div>

      </div>

    </div>
  )
}