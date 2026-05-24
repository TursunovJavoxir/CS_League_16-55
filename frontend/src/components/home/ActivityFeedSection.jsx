import SectionCard from "./SectionCard"

export default function ActivityFeedSection({
  activity = []
}) {
  return (
    <SectionCard
      title="Live Activity"
      subtitle="Competitive ecosystem"
    >
      <div className="space-y-4">
        {activity.map((item, index) => (
          <div
            key={index}
            className="
              bg-slate-800/70
              border
              border-slate-700
              rounded-2xl
              p-5
              hover:border-orange-500/30
              transition-all
              duration-300
            "
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">
                {item.icon}
              </div>

              <div className="flex-1">
                <div className="text-white font-bold text-lg mb-2">
                  {item.title}
                </div>

                <div className="text-gray-400">
                  {item.subtitle}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}