import AdvancedMatchCard from "../AdvancedMatchCard"

import {
  TOURNAMENT_ROUNDS,
  TOURNAMENT_ROUND_STYLES
} from "../../constants/tournamentRounds"

import {
  MATCH_STATUS
} from "../../constants/matchStatuses"

export default function TournamentRoundColumn({
  round,
  roundIndex,
  rounds,
  groupedMatches,
  activeRound,
  tournament,
  cardRefs,
  setHoveredPlayer,
  hoveredPlayer
}) {
  const roundMatches =
    groupedMatches[round.key] || []

  const isActive =
    activeRound === round.key

  const isCurrentRound =
    roundMatches.some(
      m => m.status === MATCH_STATUS.PENDING
    )

  const roundStyle =
    TOURNAMENT_ROUND_STYLES[round.key]

  return (
    <div
      className={`
        relative

        flex
        flex-col
        items-start
        justify-start
        self-start

        gap-20

        px-10
        py-8

        rounded-[34px]

        border
        backdrop-blur-sm

        transition-all
        duration-500

        ${roundStyle.container}

        ${
          isActive
            ? `
              scale-[1.01]
              z-20
            `
            : `
              scale-100
            `
        }
      `}
      style={{
        paddingTop:
          roundIndex === 0
            ? "0px"
            : `${roundIndex * 40}px`
      }}
    >
      <div
        className={`
          font-bold
          text-xl
          md:text-3xl
          text-center
          mb-6

          ${roundStyle.title}
        `}
      >
        {round.title}
      </div>

      {round.key === TOURNAMENT_ROUNDS.QUALIFICATION &&
        tournament.bye_players?.length > 0 && (
          <div
            className="
              flex
              flex-wrap
              gap-2
              mb-6
            "
          >
            {tournament.bye_players.map((player, index) => (
              <div
                key={index}
                className="
                  px-3
                  py-1

                  rounded-lg

                  bg-purple-500/20

                  border
                  border-purple-500/30

                  text-purple-300

                  text-xs
                  font-bold
                "
              >
                BYE • {player}
              </div>
            ))}
          </div>
        )}

      <div
        className="flex flex-col"
        style={{
          gap: roundStyle.gap
        }}
      >
        {roundMatches.map((match) => (
          <div
            key={match.id}
            ref={(el) => {
              cardRefs.current[match.id] = el
            }}
          >
            <div
              className="
                transition-all
                duration-500
                opacity-100
                scale-100
              "
            >
              <AdvancedMatchCard
                match={match}
                hoveredPlayer={hoveredPlayer}
                setHoveredPlayer={setHoveredPlayer}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}