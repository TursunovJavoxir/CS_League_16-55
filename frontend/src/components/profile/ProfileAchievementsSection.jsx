import AchievementCard from "./AchievementCard"

export default function ProfileAchievementsSection({
  achievements = []
}) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-[32px]
        p-8
        mb-10
      "
    >
      <div className="mb-8">
        <div
          className="
            uppercase
            tracking-[0.3em]
            text-orange-400
            text-sm
            mb-3
          "
        >
          Player Identity
        </div>

        <h2 className="text-5xl font-black">
          Достижения
        </h2>
      </div>

      {achievements.length === 0 ? (
        <div
          className="
            text-gray-500
            text-xl
          "
        >
          У игрока пока нет достижений
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          "
        >
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={index}
              achievement={achievement}
            />
          ))}
        </div>
      )}
    </div>
  )
}