import { translateRank } from "../../utils/translations"

export default function RankBadge({
  rank,
  size = "lg"
}) {
  const styles = {
    Bronze: `
      bg-amber-700/20
      border-amber-600/30
      text-amber-400
    `,

    Silver: `
      bg-slate-500/20
      border-slate-400/30
      text-slate-300
    `,

    Gold: `
      bg-yellow-500/20
      border-yellow-400/30
      text-yellow-300
    `,

    Platinum: `
      bg-cyan-500/20
      border-cyan-400/30
      text-cyan-300
    `,

    Diamond: `
      bg-purple-500/20
      border-purple-400/30
      text-purple-300
    `,

    Elite: `
      bg-red-500/20
      border-red-400/30
      text-red-300
    `
  }

  const sizes = {
    sm: "px-4 py-2 rounded-xl text-sm",
    lg: "px-5 py-3 rounded-2xl text-lg"
  }

  return (
    <div
      className={`
        inline-flex
        items-center
        border
        font-bold
        ${sizes[size] || sizes.lg}
        ${styles[rank] || "bg-slate-800 border-slate-700 text-slate-300"}
      `}
    >
      Ранг: {translateRank(rank)}
    </div>
  )
}