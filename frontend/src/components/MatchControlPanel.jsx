import { useEffect, useState } from "react"
import { apiFetch } from "../utils/api"


export default function MatchControlPanel() {

  const [tournaments, setTournaments] = useState([])

  const [selectedTournament, setSelectedTournament] = useState("")

  const [matches, setMatches] = useState([])

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const [selectedMatch, setSelectedMatch] = useState(null)

  const [selectedWinner, setSelectedWinner] = useState("")

  const [score, setScore] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {

    apiFetch("/tournaments")
      .then(res => res.json())
      .then(data => {

        setTournaments(data)

      })

  }, [])

  const loadMatches = async (tournamentId) => {

    setSelectedTournament(tournamentId)

    try {

      const response = await apiFetch(
        `/tournaments/${tournamentId}/matches`
      )

      const data = await response.json()

      setMatches(data)

    } catch {

      setError("Ошибка загрузки матчей")

    }

  }

  const openFinishModal = (
    match,
    winnerName
  ) => {

    setSelectedMatch(match)

    setSelectedWinner(winnerName)

    setScore("")

  }

  const closeModal = () => {

    setSelectedMatch(null)

    setSelectedWinner("")

    setScore("")

  }

  const finishMatch = async () => {

    if (!score) {

      setError("Введите счёт матча")

      return

    }

    setMessage("")
    setError("")
    setIsSubmitting(true)

    try {

      const responsePlayer = await apiFetch(
        `/players/nickname/${selectedWinner}`
      )

      const playerData = await responsePlayer.json()

      const winnerId = playerData.id

      const response = await apiFetch(
        `/tournaments/${selectedTournament}/matches/${selectedMatch.id}/finish?winner_id=${winnerId}&score=${score}`,
        {
          method: "POST"
        }
      )

      const data = await response.json()

      if (!response.ok) {

        setError(data.detail || "Ошибка")

        setIsSubmitting(false)

        return

      }

      setMessage("Матч успешно завершён")

      closeModal()

      loadMatches(selectedTournament)

    } catch {

      setError("Ошибка сервера")

    }

    setIsSubmitting(false)

  }

  return (

    <>

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

          Управление матчами

        </h2>

        <div className="mb-6">

          <select
            value={selectedTournament}
            onChange={(e) => loadMatches(e.target.value)}
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

          <div className="bg-green-500/20 text-green-400 p-3 rounded-xl mb-6">

            {message}

          </div>

        )}

        {error && (

          <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-6">

            {error}

          </div>

        )}

        <div className="space-y-4">

          {matches
            .filter(match => {

              return (
                match.player1 &&
                match.player2 &&
                match.status === "pending"
              )

            })
            .map((match) => (

              <div
                key={match.id}
                className="
                  bg-slate-900
                  rounded-xl
                  p-5
                  border
                  border-slate-700
                "
              >

                <div className="flex justify-between items-center">

                  <div>

                    <div className="text-orange-400 font-bold mb-2">

                      {match.round}

                    </div>

                    <div className="text-xl font-bold">

                      {match.player1}

                      {" vs "}

                      {match.player2}

                    </div>

                    <div className="text-gray-400 mt-2">

                      Статус: {match.status}

                    </div>

                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        openFinishModal(
                          match,
                          match.player1
                        )
                      }
                      className="
                        bg-green-500
                        hover:bg-green-600
                        transition
                        px-4
                        py-2
                        rounded-xl
                        font-bold
                      "
                    >

                      {match.player1}

                    </button>

                    <button
                      onClick={() =>
                        openFinishModal(
                          match,
                          match.player2
                        )
                      }
                      className="
                        bg-blue-500
                        hover:bg-blue-600
                        transition
                        px-4
                        py-2
                        rounded-xl
                        font-bold
                      "
                    >

                      {match.player2}

                    </button>

                  </div>

                </div>

              </div>

            ))}

        </div>

      </div>

      {selectedMatch && (

        <div
          className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
          "
        >

          <div
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-3xl
              p-8
              w-full
              max-w-xl
            "
          >

            <div className="mb-8">

              <div className="text-orange-400 text-sm mb-2">

                Завершение матча

              </div>

              <h2 className="text-4xl font-black mb-3">

                {selectedMatch.player1}

                {" vs "}

                {selectedMatch.player2}

              </h2>

              <div className="text-gray-400">

                Победитель:

                <span className="text-white font-bold ml-2">

                  {selectedWinner}

                </span>

              </div>

            </div>

            <div className="mb-8">

              <label className="block text-gray-300 mb-3">

                Счёт матча

              </label>

              <input
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="Например: 16:12"
                className="
                  w-full
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-2xl
                  px-5
                  py-4
                  text-white
                  outline-none
                  focus:border-orange-500
                "
              />

            </div>

            <div className="flex gap-4">

              <button
                onClick={closeModal}
                className="
                  flex-1
                  bg-slate-700
                  hover:bg-slate-600
                  transition
                  py-4
                  rounded-2xl
                  font-bold
                "
              >

                Отмена

              </button>

              <button
                onClick={finishMatch}
                disabled={isSubmitting}
                className="
                  flex-1
                  bg-orange-500
                  hover:bg-orange-600
                  transition
                  py-4
                  rounded-2xl
                  font-bold
                  disabled:opacity-50
                "
              >

                {
                  isSubmitting
                    ? "Завершение..."
                    : "Подтвердить"
                }

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  )
}