import { useState } from "react"

import { apiFetch } from "../utils/api"

export default function CreateTournamentForm() {

  const [name, setName] = useState("")

  const [season, setSeason] = useState("")

  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault()

    setMessage("")
    setError("")

    try {

      const response = await apiFetch(
        "/tournaments",
        {
          method: "POST",

          
          body: JSON.stringify({
            name,
            season,
            status: "active"
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        setError(data.detail || "Ошибка")

        return
      }

      setMessage("Турнир создан")

      setName("")
      setSeason("")

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

        Создать турнир

      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>

          <label className="block text-gray-300 mb-2">

            Название турнира

          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              focus:border-orange-500
            "
            required
          />

        </div>

        <div>

          <label className="block text-gray-300 mb-2">

            Сезон

          </label>

          <input
            type="text"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
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
              focus:border-orange-500
            "
            required
          />

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

        <button
          type="submit"
          className="
            bg-orange-500
            hover:bg-orange-600
            transition
            px-6
            py-3
            rounded-xl
            font-bold
          "
        >

          Создать

        </button>

      </form>

    </div>
  )
}