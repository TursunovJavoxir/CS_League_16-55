export default function BracketConnectors({

  rounds

}) {

  return (

    <svg
      className="
        absolute
        top-0
        left-0
        w-full
        h-full
        pointer-events-none
        overflow-visible
      "
    >

      {rounds.map((round, roundIndex) => {

        if (roundIndex === rounds.length - 1)
          return null

        return round.matches.map((match, matchIndex) => {

          if (matchIndex % 2 !== 0)
            return null

          const startX =
            210 + roundIndex * 390

          const startY =
            190 + matchIndex * 290

          const middleX =
            startX + 80

          const targetX =
            startX + 180

          const targetY =
            startY + 145

          return (

            <path
              key={`${roundIndex}-${matchIndex}`}
              d={`
                M ${startX} ${startY}
                H ${middleX}
                V ${targetY}
                H ${targetX}
              `}
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
              strokeLinecap="round"
              className="
                drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]
              "
            />

          )

        })

      })}

    </svg>

  )

}