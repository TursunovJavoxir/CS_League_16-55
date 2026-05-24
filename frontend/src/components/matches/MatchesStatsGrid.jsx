import Card from "../ui/Card"

export default function MatchesStatsGrid({
  totalMatches,
  finishedCount,
  pendingCount,
  totalEloChanges
}) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
      <Card className="p-5" hover={false}>
        <div className="text-sm text-slate-500">
          Всего матчей
        </div>

        <div className="text-3xl font-black">
          {totalMatches}
        </div>
      </Card>

      <Card className="p-5" hover={false}>
        <div className="text-sm text-slate-500">
          Завершено
        </div>

        <div className="text-3xl font-black text-emerald-400">
          {finishedCount}
        </div>
      </Card>

      <Card className="p-5" hover={false}>
        <div className="text-sm text-slate-500">
          Ожидают игру
        </div>

        <div className="text-3xl font-black text-yellow-300">
          {pendingCount}
        </div>
      </Card>

      <Card className="p-5" hover={false}>
        <div className="text-sm text-slate-500">
          ELO изменений
        </div>

        <div className="text-3xl font-black text-cyan-300">
          {totalEloChanges}
        </div>
      </Card>
    </div>
  )
}