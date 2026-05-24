import SectionCard from "./SectionCard"

export default function RecentMatchesSection({
  matches = []
}) {
  return (
    <SectionCard
      title="Последние матчи"
      subtitle="Live competitive activity"
    >
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="
              bg-slate-800/70
              border
              border-slate-700
              rounded-2xl
              p-5
            "
          >
            <div
              className="
                flex
                justify-between
                items-center
                gap-5
              "
            >
              <div>
                <div
                  className="
                    text-xl
                    font-black
                    mb-2
                  "
                >
                  {match.winner}

                  <span className="text-gray-500 mx-3">
                    победил
                  </span>

                  {
                    match.winner === match.player1
                      ? match.player2
                      : match.player1
                  }
                </div>

                <div className="text-gray-400">
                  {match.match_type}
                  {" • "}
                  {match.score}
                </div>
              </div>

              <div
                className="
                  text-green-400
                  font-black
                  text-3xl
                "
              >
                {
                  match.elo_change
                    ?.split("/")[0]
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}