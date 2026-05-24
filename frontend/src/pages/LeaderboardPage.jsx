import {
  useState
} from "react"


import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader"
import LeaderboardTable from "../components/leaderboard/LeaderboardTable"
import useLeaderboard from "../hooks/useLeaderboard"

import LoadingState from "../components/ui/LoadingState"
import ErrorState from "../components/ui/ErrorState"
import TopPlayersGrid from "../components/leaderboard/TopPlayersGrid"
import useLeaderboardFilter from "../hooks/useLeaderboardFilter"


export default function LeaderboardPage() {

  const [search, setSearch] = useState("")

  const {
    players,
    seasons,
    selectedSeason,
    setSelectedSeason,
    loading,
    error
  } = useLeaderboard()

  const {
    topThree,
    remainingPlayers
  } = useLeaderboardFilter({
    players,
    search
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <LoadingState text="Загрузка рейтинга..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <ErrorState
          title="Ошибка рейтинга"
          description={error}
        />
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      <LeaderboardHeader
        search={search}
        setSearch={setSearch}
        seasons={seasons}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
      />

      <TopPlayersGrid players={topThree} />

      <LeaderboardTable players={remainingPlayers} />

    </div>
  )
}

