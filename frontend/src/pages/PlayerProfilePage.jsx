import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useParams } from "react-router-dom"
import { apiFetch } from "../utils/api"
import LoadingState from "../components/ui/LoadingState"
import ErrorState from "../components/ui/ErrorState"




import PlacementRevealModal from "../components/profile/PlacementRevealModal"
import ProfileHero from "../components/profile/ProfileHero"
import ProfileStatsGrid from "../components/profile/ProfileStatsGrid"
import ProfileAchievementsSection from "../components/profile/ProfileAchievementsSection"
import ProfileSeasonRewardsSection from "../components/profile/ProfileSeasonRewardsSection"
import ProfileMatchHistorySection from "../components/profile/ProfileMatchHistorySection"




export default function PlayerProfilePage() {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { currentPlayer } = useAuth()
  const { id } = useParams()

  const [player, setPlayer] = useState(null)

  

  const [matches, setMatches] = useState([])

  const [
    showPlacementComplete,
    setShowPlacementComplete
  ] = useState(false)
  const [ revealRank, setRevealRank ] = useState(false) 
  const [ revealElo, setRevealElo ] = useState(false) 
  const [ revealContinue, setRevealContinue ] = useState(false)

  

  
  useEffect(() => {
    setLoading(true)
    setError("")

    apiFetch(`/players/${id}`)
      .then(res => {

        if (!res.ok) {
          throw new Error("Ошибка загрузки профиля")
        }

        return res.json()
      })

      .then(data => {

        setPlayer(data)

        setMatches(data.recent_matches || [])

        const isOwnProfile =
          currentPlayer?.id === data.id

        const placementRevealKey =
          `placement_complete_${currentPlayer?.id}_${data.id}`

        if (
          isOwnProfile &&
          !data.is_placement &&
          data.placement_matches >= 5
        ) {

          const alreadyShown =
            localStorage.getItem(
              placementRevealKey
            )

          if (!alreadyShown) {

            setShowPlacementComplete(true)

            setTimeout(() => {
              setRevealRank(true)
            }, 1200)

            setTimeout(() => {
              setRevealElo(true)
            }, 2400)

            setTimeout(() => {
              setRevealContinue(true)
            }, 3400)

            localStorage.setItem(
              placementRevealKey,
              "true"
            )
          }
        }
      })

      .catch(err => {

        setError(
          err.message ||
          "Ошибка загрузки профиля"
        )

      })

      .finally(() => {

        setLoading(false)

      })

  }, [id, currentPlayer])

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <LoadingState text="Загрузка профиля..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 md:p-10">
        <ErrorState
          title="Ошибка профиля"
          description={error}
        />
      </div>
    )
  }

  if (!player) {
    return (
      <div className="p-6 md:p-10">
        <ErrorState
          title="Профиль не найден"
          description="Игрок с таким ID не найден или данные профиля недоступны."
        />
      </div>
    )
  }
  const recentForm = matches

    .filter(
      match => match.result
    )

    .slice(0, 5)

    .map(
      match => match.result
    )

  return (
 <>

{showPlacementComplete && (
  <PlacementRevealModal
    player={player}
    revealRank={revealRank}
    revealElo={revealElo}
    revealContinue={revealContinue}
    onClose={() => setShowPlacementComplete(false)}
  />
)}



    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      {/* HERO */}

      <ProfileHero
        player={player}
        recentForm={recentForm}
      />

      {/* STATS */}

      <ProfileStatsGrid player={player} />


      {/* ACHIEVEMENTS */}

      <ProfileAchievementsSection
        achievements={player?.achievements || []}
      />

      {/* SEASON REWARDS */}

      <ProfileSeasonRewardsSection
        rewards={player?.season_rewards || []}
      />        


      {/* HISTORY */}

      <ProfileMatchHistorySection
        matches={matches}
        player={player}
      />

    </div>
  
 </>
)
}

