import { useMemo } from "react"

import {
  MATCH_STATUS
} from "../constants/matchStatuses"

import {
  TOURNAMENT_ROUNDS,
  TOURNAMENT_ROUND_ORDER,
  TOURNAMENT_ROUND_LABELS
} from "../constants/tournamentRounds"

export default function useTournamentBracket(matches = []) {
  const groupedMatches =
    useMemo(() => ({

      [TOURNAMENT_ROUNDS.QUALIFICATION]:
        matches.filter(
          m => m.round === TOURNAMENT_ROUNDS.QUALIFICATION
        ),

      [TOURNAMENT_ROUNDS.ROUND_OF_16]:
        matches.filter(
          m => m.round === TOURNAMENT_ROUNDS.ROUND_OF_16
        ),

      [TOURNAMENT_ROUNDS.QUARTERFINAL]:
        matches.filter(
          m => m.round === TOURNAMENT_ROUNDS.QUARTERFINAL
        ),

      [TOURNAMENT_ROUNDS.SEMIFINAL]:
        matches.filter(
          m => m.round === TOURNAMENT_ROUNDS.SEMIFINAL
        ),

      [TOURNAMENT_ROUNDS.GRAND_FINAL]:
        matches.filter(
          m => m.round === TOURNAMENT_ROUNDS.GRAND_FINAL
        )

    }), [matches])

  const rounds =
    useMemo(() => {

      return TOURNAMENT_ROUND_ORDER
        .filter(
          round =>
            groupedMatches[round]?.length > 0
        )
        .map(
          round => ({
            key: round,
            title: TOURNAMENT_ROUND_LABELS[round]
          })
        )

    }, [groupedMatches])

  const finishedMatches =
    useMemo(() => {

      return matches.filter(
        match =>
          match.status === MATCH_STATUS.FINISHED
      ).length

    }, [matches])

  const activeRound =
    useMemo(() => {

      const pendingMatch =
        matches.find(
          m =>
            m.status !== MATCH_STATUS.FINISHED
        )

      if (!pendingMatch) {
        return TOURNAMENT_ROUNDS.GRAND_FINAL
      }

      return pendingMatch.round

    }, [matches])

  return {
    groupedMatches,
    rounds,
    finishedMatches,
    activeRound
  }
}