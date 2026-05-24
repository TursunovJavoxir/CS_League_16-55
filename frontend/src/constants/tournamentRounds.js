export const TOURNAMENT_ROUNDS = {
  QUALIFICATION: "Qualification",
  ROUND_OF_16: "Round of 16",
  QUARTERFINAL: "Quarterfinal",
  SEMIFINAL: "Semifinal",
  GRAND_FINAL: "Grand Final"
}

export const TOURNAMENT_ROUND_ORDER = [
  TOURNAMENT_ROUNDS.QUALIFICATION,
  TOURNAMENT_ROUNDS.ROUND_OF_16,
  TOURNAMENT_ROUNDS.QUARTERFINAL,
  TOURNAMENT_ROUNDS.SEMIFINAL,
  TOURNAMENT_ROUNDS.GRAND_FINAL
]

export const TOURNAMENT_ROUND_LABELS = {

  [TOURNAMENT_ROUNDS.QUALIFICATION]: "Квалификация",
  [TOURNAMENT_ROUNDS.ROUND_OF_16]: "1/8 финала",
  [TOURNAMENT_ROUNDS.QUARTERFINAL]: "Четвертьфинал",
  [TOURNAMENT_ROUNDS.SEMIFINAL]: "Полуфинал",
  [TOURNAMENT_ROUNDS.GRAND_FINAL]: "Гранд Финал"

}

export const TOURNAMENT_ROUND_STYLES = {

  [TOURNAMENT_ROUNDS.QUALIFICATION]: {

    container: `
      border-emerald-500/10

      bg-gradient-to-b
      from-emerald-500/5
      to-transparent
    `,

    title: `
      text-emerald-300
    `,

    gap: "40px"

  },

  [TOURNAMENT_ROUNDS.ROUND_OF_16]: {
    container: `
      border-blue-500/10
      bg-gradient-to-b
      from-blue-500/5
      to-transparent
    `,
    title: `
      text-blue-300
    `,
    gap: "70px"
  },

  [TOURNAMENT_ROUNDS.QUARTERFINAL]: {

    container: `
      border-cyan-500/10

      bg-gradient-to-b
      from-cyan-500/5
      to-transparent
    `,

    title: `
      text-cyan-300
    `,

    gap: "120px"

  },

  [TOURNAMENT_ROUNDS.SEMIFINAL]: {

    container: `
      border-orange-500/15

      bg-gradient-to-b
      from-orange-500/8
      to-transparent

      shadow-[0_0_60px_rgba(255,120,0,0.08)]
    `,

    title: `
      text-orange-300
    `,

    gap: "180px"

  },

  [TOURNAMENT_ROUNDS.GRAND_FINAL]: {

    container: `
      border-yellow-500/20

      bg-gradient-to-b
      from-yellow-500/10
      to-transparent

      shadow-[0_0_80px_rgba(255,200,0,0.10)]
    `,

    title: `
      text-amber-300
      drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]
    `,

    gap: "260px"

  }

}