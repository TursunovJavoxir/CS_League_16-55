import DynamicBracketConnectors from "../DynamicBracketConnectors"
import TournamentRoundColumn from "./TournamentRoundColumn"

export default function TournamentBracket({
  matches,
  rounds,
  groupedMatches,
  activeRound,
  tournament,
  containerRef,
  cardRefs,
  roundRefs,
  hoveredPlayer,
  setHoveredPlayer
}) {
  return (
    <div
      ref={containerRef}
      className="
        relative
        overflow-x-auto
        overflow-y-hidden
        bg-[#020617]
        border
        border-slate-800
        rounded-3xl
        p-6
        md:p-12
        min-h-[900px]
        w-full
        scroll-smooth
      "
    >
      <DynamicBracketConnectors
        containerRef={containerRef}
        cardRefs={cardRefs}
        matches={matches}
        hoveredPlayer={hoveredPlayer}
      />

      <div
        className="
          relative
          z-10
          flex
          items-start
          gap-40
          md:gap-[260px]
          min-w-max
          pb-24
          pt-6
          px-8
        "
      >
        {rounds.map((round, roundIndex) => (
          <div
            key={round.key}
            ref={(el) => {
              roundRefs.current[round.key] = el
            }}
          >
            <TournamentRoundColumn
              round={round}
              roundIndex={roundIndex}
              rounds={rounds}
              groupedMatches={groupedMatches}
              activeRound={activeRound}
              tournament={tournament}
              cardRefs={cardRefs}
              hoveredPlayer={hoveredPlayer}
              setHoveredPlayer={setHoveredPlayer}
            />
          </div>
        ))}
      </div>
    </div>
  )
}