import { useEffect, useState } from "react"

import { apiFetch } from "../utils/api"
import useLiveRefresh from "./useLiveRefresh"

export default function useLeaderboard() {
  const [players, setPlayers] = useState([])
  const [seasons, setSeasons] = useState([])
  
  const [selectedSeason, setSelectedSeason] =
  useState("all")

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  const loadPlayers = async () => {

    try {

        setError("")

        const seasonsRes =
        await apiFetch("/seasons")

        if (!seasonsRes.ok) {

        throw new Error(
            "Ошибка загрузки сезонов"
        )

        }

        const seasonsData =
            await seasonsRes.json()

        
        const normalizedSeasons =
            Array.isArray(seasonsData)
                ? seasonsData
                : []

            setSeasons(normalizedSeasons)

            

        // Не выбираем сезон автоматически,
        // чтобы по умолчанию показывались все игроки.

        const endpoint =
            selectedSeason !== "all"
                ? `/players/season/${selectedSeason}`
                : "/players"

        const playersRes =
        await apiFetch(endpoint)

        if (!playersRes.ok) {

        throw new Error(
            "Ошибка загрузки рейтинга"
        )

        }

        const playersData =
        await playersRes.json()

        setPlayers(

        Array.isArray(playersData)
            ? playersData
            : []

        )

    }

    catch (err) {

        setError(
        err.message ||
        "Ошибка загрузки рейтинга"
        )

    }

    finally {

        setLoading(false)

    }

    }

  useLiveRefresh(
    loadPlayers,
    45000
  )

  useEffect(() => {
    loadPlayers()
  }, [selectedSeason])

  return {

    players,
    seasons,

    selectedSeason,
    setSelectedSeason,

    loading,
    error

    }
}