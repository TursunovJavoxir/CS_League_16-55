import { useState } from "react"

import { apiFetch } from "../utils/api"

export default function useTournamentDetails(id) {
  const [tournament, setTournament] =
    useState(null)

  const [matches, setMatches] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const refreshTournamentData = async () => {
    setError("")

    try {
      const [
        tournamentRes,
        matchesRes
      ] = await Promise.all([
        apiFetch(`/tournaments/${id}`),
        apiFetch(`/tournaments/${id}/matches`)
      ])

      if (!tournamentRes.ok || !matchesRes.ok) {
        throw new Error("Ошибка загрузки турнира")
      }

      const tournamentData =
        await tournamentRes.json()

      const matchesData =
        await matchesRes.json()

      setTournament((prev) => {
        const prevString =
          JSON.stringify(prev)

        const newString =
          JSON.stringify(tournamentData)

        return prevString !== newString
          ? tournamentData
          : prev
      })

      setMatches((prev) => {
        const prevString =
          JSON.stringify(prev)

        const newString =
          JSON.stringify(matchesData)

        return prevString !== newString
          ? matchesData
          : prev
      })
    } catch (error) {
      console.error(
        "Tournament refresh failed:",
        error
      )

      setError(
        error.message ||
        "Ошибка загрузки турнира"
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    tournament,
    matches,
    loading,
    error,
    refreshTournamentData
  }
}