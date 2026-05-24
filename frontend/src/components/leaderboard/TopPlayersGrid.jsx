import TopPlayerCard from "./TopPlayerCard"

export default function TopPlayersGrid({
  players
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
        mb-12
      "
    >
      {players.map((player, index) => (
        <TopPlayerCard
          key={player.id}
          player={player}
          position={index + 1}
        />
      ))}
    </div>
  )
}