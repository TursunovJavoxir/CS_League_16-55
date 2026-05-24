import { useMemo } from "react"

export default function useLeaderboardFilter({
  players,
  search
}) {
  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.nickname
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [players, search])

  const topThree =
    filteredPlayers.slice(0, 3)

  const remainingPlayers =
    filteredPlayers.slice(3)

  return {
    filteredPlayers,
    topThree,
    remainingPlayers
  }
}