import {
  useMemo,
  useState
} from "react"

import useLiveRefresh from "../hooks/useLiveRefresh"
import { apiFetch } from "../utils/api"

import LoadingState from "../components/ui/LoadingState"
import ErrorState from "../components/ui/ErrorState"

import TopPlayersSection from "../components/home/TopPlayersSection"
import RecentMatchesSection from "../components/home/RecentMatchesSection"
import ActiveTournamentSection from "../components/home/ActiveTournamentSection"
import LatestChampionSection from "../components/home/LatestChampionSection"
import ActivityFeedSection from "../components/home/ActivityFeedSection"
import HomeHero from "../components/home/HomeHero"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [players, setPlayers] = useState([])
  const [matches, setMatches] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [activity, setActivity] = useState([])

  const loadHomepageData = async () => {
    try {
      setError("")

      const [
        playersRes,
        matchesRes,
        tournamentsRes,
        activityRes
      ] = await Promise.all([
        apiFetch("/players"),
        apiFetch("/matches"),
        apiFetch("/tournaments"),
        apiFetch("/activity")
      ])

      if (
        !playersRes.ok ||
        !matchesRes.ok ||
        !tournamentsRes.ok ||
        !activityRes.ok
      ) {
        throw new Error("Ошибка загрузки главной страницы")
      }

      const playersData = await playersRes.json()
      const matchesData = await matchesRes.json()
      const tournamentsData = await tournamentsRes.json()
      const activityData = await activityRes.json()

      setPlayers(
        Array.isArray(playersData)
          ? playersData
          : []
      )

      setMatches(
        Array.isArray(matchesData)
          ? matchesData
              .filter((match) => match.winner)
              .reverse()
              .slice(0, 5)
          : []
      )

      setTournaments(
        Array.isArray(tournamentsData)
          ? tournamentsData
          : []
      )

      setActivity(
        Array.isArray(activityData)
          ? activityData
          : []
      )
    } catch (err) {
      setError(
        err.message ||
        "Ошибка загрузки главной страницы"
      )
    } finally {
      setLoading(false)
    }
  }

  useLiveRefresh(
    loadHomepageData,
    30000
  )

  const topPlayers = useMemo(() => {
    return [...players]
      .sort((a, b) => (b.elo || 0) - (a.elo || 0))
      .slice(0, 3)
  }, [players])

  const activeTournament = tournaments.find(
    (tournament) => tournament.status === "active"
  )

  const latestChampion = [...tournaments]
    .reverse()
    .find(
      (tournament) =>
        tournament.status === "finished" &&
        tournament.winner
    )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <LoadingState text="Загрузка главной страницы..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <ErrorState
          title="Ошибка главной страницы"
          description={error}
        />
      </div>
    )
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#020617]
        text-white
        overflow-hidden
      "
    >
      <HomeHero
        playersCount={players.length}
        matchesCount={matches.length}
        tournamentsCount={tournaments.length}
      />

      <div
        className="
          max-w-[1700px]
          mx-auto
          px-6
          md:px-10
          py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-[1.2fr_0.8fr]
            gap-8
          "
        >
          <div className="space-y-8">
            <TopPlayersSection players={topPlayers} />

            <RecentMatchesSection matches={matches} />
          </div>

          <div className="space-y-8">
            <ActiveTournamentSection
              tournament={activeTournament}
            />

            <LatestChampionSection
              champion={latestChampion}
            />

            <ActivityFeedSection
              activity={activity}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
