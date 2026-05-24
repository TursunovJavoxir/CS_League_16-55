import { Link } from "react-router-dom"

import SectionCard from "./SectionCard"

export default function ActiveTournamentSection({
  tournament
}) {

  if (!tournament) {
    return null
  }

  return (
    <SectionCard
      title="Активный турнир"
      subtitle="Текущий live bracket"
    >

      <Link
        to={`/tournaments/${tournament.id}`}
        className="
          block

          bg-gradient-to-br
          from-orange-500/10
          to-transparent

          border
          border-orange-500/20

          rounded-3xl
          p-8

          hover:border-orange-400/40

          transition-all
          duration-300
        "
      >

        <div
          className="
            text-orange-400
            uppercase
            tracking-[0.25em]
            text-sm
            mb-4
          "
        >

          LIVE NOW

        </div>

        <div
          className="
            text-4xl
            font-black
            mb-5
          "
        >

          {tournament.name}

        </div>

        <div className="text-gray-400">

          Сезон:
          {" "}
          {tournament.season}

        </div>

      </Link>

    </SectionCard>
  )
}