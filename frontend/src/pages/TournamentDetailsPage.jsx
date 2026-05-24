import { useRef, useState } from "react"
import { useParams } from "react-router-dom"

import useLiveRefresh from "../hooks/useLiveRefresh"



import LoadingState from "../components/ui/LoadingState"
import ErrorState from "../components/ui/ErrorState"
import TournamentHero from "../components/tournament/TournamentHero"
import useTournamentBracket from "../hooks/useTournamentBracket"
import TournamentBracket from "../components/tournament/TournamentBracket"
import useMobileRoundAutoCenter from "../hooks/useMobileRoundAutoCenter"
import useTournamentDetails from "../hooks/useTournamentDetails"



export default function TournamentDetailsPage() {

  const [hoveredPlayer, setHoveredPlayer] =
    useState(null)

  const { id } = useParams()

  const {
    tournament,
    matches,
    loading,
    error,
    refreshTournamentData
  } = useTournamentDetails(id)

  const containerRef =
    useRef(null)

  const cardRefs =
    useRef({})

  const roundRefs =
    useRef({})



  
  // INITIAL LOAD + LIVE UPDATES
  useLiveRefresh(
    refreshTournamentData,
    10000
  )
  

  

  // GROUPED MATCHES

  const {
    groupedMatches,
    rounds,
    finishedMatches,
    activeRound
  } = useTournamentBracket(matches)

  // MOBILE AUTO CENTER
  useMobileRoundAutoCenter({
    containerRef,
    roundRefs,
    activeRound
  })
  // LOADING

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <LoadingState text="Загрузка турнира..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <ErrorState
          title="Ошибка турнира"
          description={error}
        />
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
        <ErrorState
          title="Турнир не найден"
          description="Турнир не найден или данные недоступны."
        />
      </div>
    )
  }

  return (

    <div
      className="
        p-4
        md:p-8
        text-white
      "
    >
      {/* TOURNAMENT HERO */}
      <TournamentHero
        tournament={tournament}
        matches={matches}
        finishedMatches={finishedMatches}
      />
      
      {/* BRACKET */}
      <TournamentBracket
        matches={matches}
        rounds={rounds}
        groupedMatches={groupedMatches}
        activeRound={activeRound}
        tournament={tournament}
        containerRef={containerRef}
        cardRefs={cardRefs}
        roundRefs={roundRefs}
        hoveredPlayer={hoveredPlayer}
        setHoveredPlayer={setHoveredPlayer}
      />

    </div>

  )

}