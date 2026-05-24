import { translateRank } from "../../utils/translations"

export default function RankBadge({
  rank
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

  return (

    <div
      className={`
        inline-flex
        items-center
        px-4
        py-2
        rounded-xl
        border
        font-bold
        text-sm
        ${styles[rank]}
      `}
    >

      Ранг: {translateRank(rank)}

    </div>

  )
}