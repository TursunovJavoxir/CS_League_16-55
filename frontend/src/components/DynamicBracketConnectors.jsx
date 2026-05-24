import {
  useEffect,
  useState
} from "react"

export default function DynamicBracketConnectors({

  containerRef,
  cardRefs,
  matches,

  hoveredPlayer

}) {

  const [isReady, setIsReady] =
    useState(false)

  useEffect(() => {

    setIsReady(false)

    const frame =
      requestAnimationFrame(() => {

        requestAnimationFrame(() => {

          setIsReady(true)

        })

      })

    return () =>
      cancelAnimationFrame(frame)

  }, [matches])

  if (
    !containerRef.current ||
    !isReady
  )
    return null

  const getPlayerSlotPosition = (

    match,
    target = "winner"

  ) => {

    const card =
      cardRefs.current[match.id]

    if (!card)
      return null

    let selector =
      "[data-player-slot='player1']"

    // WINNER SLOT

    if (target === "winner") {

      if (
        match.winner &&
        match.winner === match.player2
      ) {

        selector =
          "[data-player-slot='player2']"

      }

    }

    // NEXT MATCH SLOT

    if (target === "player1") {

      selector =
        "[data-player-slot='player1']"

    }

    if (target === "player2") {

      selector =
        "[data-player-slot='player2']"

    }

    const slot =
      card.querySelector(selector)

    if (!slot)
      return null

    const rect =
      slot.getBoundingClientRect()

    const parentRect =
      containerRef.current.getBoundingClientRect()

    return {

      x:
        rect.left -
        parentRect.left +
        rect.width,

      y:
        rect.top -
        parentRect.top +
        rect.height / 2

    }

  }

  const paths = []

  matches.forEach(match => {

    if (!match.next_match_id)
      return

    const nextMatch =
      matches.find(
        m =>
          m.id ===
          match.next_match_id
      )

    if (!nextMatch)
      return

    const start =
      getPlayerSlotPosition(
        match,
        "winner"
      )

    const end =
      getPlayerSlotPosition(
        nextMatch,
        match.next_match_slot === 2
          ? "player2"
          : "player1"
      )

    if (!start || !end)
      return

    const lineColor =
      match.status === "finished"
        ? "#22c55e"
        : match.status === "pending"
        ? "#ff7b00"
        : "#334155"

    const glowOpacity =
      match.status === "finished"
        ? 0.24
        : match.status === "pending"
        ? 0.14
        : 0.06

    // SMART BRACKET ROUTING

    const startOffset = 10

    const endOffset = 34

    const laneOffset =

      match.next_match_slot === 2
        ? 14
        : -14

    const middleX =
      start.x +
      ((end.x - start.x) * 0.3) +
      laneOffset

    // START SEGMENT

    const startLineX =
      start.x + startOffset

    // END SEGMENT

    const endLineX =
      end.x - endOffset

    const path = `

      M ${start.x} ${start.y}

      L ${startLineX} ${start.y}

      L ${middleX} ${start.y}

      L ${middleX} ${end.y}

      L ${endLineX} ${end.y}

      L ${end.x} ${end.y}

    `

    paths.push({

      path,
      lineColor,
      glowOpacity,
      status: match.status,

      player1: match.player1,
      player2: match.player2,
      winner: match.winner,

      nextMatchId: match.next_match_id

    })

  })
    const getPlayerPathMatches = () => {

      if (!hoveredPlayer)
        return []

      return matches.filter(match => {

        return (

          match.player1 === hoveredPlayer ||

          match.player2 === hoveredPlayer ||

          match.winner === hoveredPlayer

        )

      })

    }
    const playerPathMatchIds =
      getPlayerPathMatches().map(
        match => match.id
      )
    const isPlayerInPath = (item, index) => {

      return playerPathMatchIds.includes(
        matches[index]?.id
      )

    }
   

    
  return (

    <svg
      className="
        absolute
        top-0
        left-0
        w-full
        h-full
        pointer-events-none
        z-0
        overflow-visible
      "
    >

      <defs>

        <filter
          id="glow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >

          <feGaussianBlur
            stdDeviation="2.2"
            result="blur"
          />

          <feMerge>

            <feMergeNode in="blur" />

            <feMergeNode in="SourceGraphic" />

          </feMerge>

        </filter>

      </defs>

      {paths.map((item, index) => (

        <g key={index}>

          {/* BACK GLOW */}

          <path
            d={item.path}
            stroke={item.lineColor}
            strokeWidth="3"
            fill="none"
            opacity={item.glowOpacity}
            filter="url(#glow)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* MAIN LINE */}

          <path
            d={item.path}
            stroke={item.lineColor}
            strokeWidth="2"
            fill="none"
            opacity={
              item.status === "waiting"
                ? 0.35
                : 1
            }
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ENERGY FLOW */}

          {item.status !== "waiting" && (

            <>

              {/* MAIN FLOW */}

              <path
                d={item.path}
                stroke={item.lineColor}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                opacity={

                  hoveredPlayer

                    ? isPlayerInPath(item, index)
                      ? 1
                      : 0.08

                    : item.status === "finished"
                      ? 0.9
                      : 0.28
                }
                strokeDasharray={
                  item.status === "finished"
                    ? "120 900"
                    : "120 1200"
                }
              >

                <animate
                  attributeName="stroke-dashoffset"
                  from="1200"
                  to="0"
                  dur={
                    item.status === "finished"
                      ? "1.8s"
                      : "5s"
                  }
                  repeatCount="indefinite"
                />

              </path>

              {/* SECONDARY FLOW */}

              {item.status === "finished" && (

                <path
                  d={item.path}
                  stroke="#86efac"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                  strokeDasharray="60 1400"
                >

                  <animate
                    attributeName="stroke-dashoffset"
                    from="1400"
                    to="0"
                    dur="6s"
                    repeatCount="indefinite"
                  />

                </path>

              )}

            </>

          )}

        </g>

      ))}

    </svg>

  )

}