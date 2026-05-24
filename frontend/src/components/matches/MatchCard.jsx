import { Link } from "react-router-dom"

import Badge from "../ui/Badge"
import Button from "../ui/Button"
import Card from "../ui/Card"

export default function MatchCard({
  match,
  isAdmin,
  onFinishMatch
}) {
  const isPending =
    !match.winner

  const winner =
    match.winner

  const loser =
    winner === match.player1
      ? match.player2
      : match.player1

  return (
    <Card
      glow
      className="p-7"
    >
      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-8
        "
      >
        {/* LEFT */}

        <div className="flex-1">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              mb-5
            "
          >
            <Badge
              variant={
                isPending
                  ? "yellow"
                  : "green"
              }
            >
              {
                isPending
                  ? "ОЖИДАНИЕ"
                  : "ЗАВЕРШЁН"
              }
            </Badge>

            <Badge variant="orange">
              {match.match_type}
            </Badge>

            <Badge>
              {match.season || "Season"}
            </Badge>
          </div>

          <div
            className="
              text-3xl
              md:text-4xl
              font-black
              mb-4
              leading-tight
            "
          >
            {
              isPending ? (
                <>
                  <span className="text-white">
                    {match.player1}
                  </span>

                  <span className="mx-4 text-slate-500">
                    VS
                  </span>

                  <span className="text-white">
                    {match.player2}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-emerald-400">
                    {winner}
                  </span>

                  <span className="mx-4 text-slate-500">
                    победил
                  </span>

                  <span className="text-slate-300">
                    {loser}
                  </span>
                </>
              )
            }
          </div>

          <div className="text-lg text-slate-400">
            {
              isPending
                ? "Матч ещё не сыгран"
                : `Счёт: ${match.score}`
            }
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            xl:text-right
            flex
            flex-col
            items-start
            xl:items-end
          "
        >
          <div
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-slate-500
              mb-2
            "
          >
            ELO Change
          </div>

          <div
            className="
              text-5xl
              font-black
              text-cyan-300
              mb-5
            "
          >
            {
              match.elo_change
                ?.split("/")[0]
              || "0"
            }
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-3
            "
          >
            {isPending && (
              <Link to={`/matches/${match.id}/veto`}>
                <Button>
                  Открыть VETO
                </Button>
              </Link>
            )}

            {isAdmin && isPending && (
              <>
                <Button
                  variant="success"
                  onClick={() =>
                    onFinishMatch(
                      match,
                      match.player1_id
                    )
                  }
                >
                  Победил {match.player1}
                </Button>

                <Button
                  variant="primary"
                  onClick={() =>
                    onFinishMatch(
                      match,
                      match.player2_id
                    )
                  }
                >
                  Победил {match.player2}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}