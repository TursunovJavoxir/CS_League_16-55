import {
  translateAchievement,
  translateAchievementDescription
} from "../../utils/translations"

export default function AchievementCard({
  achievement
}) {
  const rarityStyles = {
    common: `
      border-slate-700
      bg-slate-800
    `,

    rare: `
      border-blue-500/30
      bg-blue-500/10
    `,

    epic: `
      border-purple-500/30
      bg-purple-500/10
    `,

    legendary: `
      border-orange-500/40
      bg-orange-500/10
      shadow-[0_0_40px_rgba(249,115,22,0.15)]
    `
  }

  return (
    <div
      className={`
        rounded-3xl
        border
        p-6
        transition-all
        duration-300
        hover:scale-[1.02]

        ${rarityStyles[achievement.rarity] || rarityStyles.common}
      `}
    >
      <div className="text-5xl mb-5">
        {achievement.icon}
      </div>

      <div className="text-2xl font-black mb-3">
        {translateAchievement(achievement.title)}
      </div>

      <div className="text-gray-400 mb-5">
        {translateAchievementDescription(achievement.description)}
      </div>

      <div
        className="
          inline-flex
          px-4
          py-2
          rounded-xl
          text-sm
          font-bold
          uppercase
          tracking-[0.15em]
          bg-black/20
        "
      >
        {achievement.rarity}
      </div>
    </div>
  )
}