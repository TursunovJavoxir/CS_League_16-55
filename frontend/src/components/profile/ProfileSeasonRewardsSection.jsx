import SeasonRewardCard from "./SeasonRewardCard"

export default function ProfileSeasonRewardsSection({
  rewards = []
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
          Competitive Legacy
        </div>

        <h2 className="text-5xl font-black">
          Сезонные награды
        </h2>
      </div>

      {rewards.length === 0 ? (
        <div
          className="
            text-gray-500
            text-xl
          "
        >
          У игрока пока нет сезонных наград
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
          {rewards.map((reward, index) => (
            <SeasonRewardCard
              key={index}
              reward={reward}
            />
          ))}
        </div>
      )}
    </div>
  )
}