export default function LeaderboardHeader({
  search,
  setSearch,
  seasons,
  selectedSeason,
  setSelectedSeason
}) {
  return (
    <div
      className="
        flex
        flex-col
        xl:flex-row
        xl:items-center
        xl:justify-between
        gap-6
        mb-10
      "
    >
      <div>
        <div
          className="
            uppercase
            tracking-[0.35em]
            text-orange-400
            text-sm
            mb-3
          "
        >
          Competitive Ranking
        </div>

        <h1
          className="
            text-6xl
            md:text-7xl
            font-black
            leading-none
            mb-4
          "
        >
          Рейтинг игроков
        </h1>

        <div className="text-gray-400 text-xl">
          Сезонная и глобальная таблица лидеров
        </div>
      </div>

      <div
        className="
          flex
          flex-col
          md:flex-row
          gap-4
          w-full
          xl:w-auto
        "
      >
        <input
          type="text"
          placeholder="Поиск игрока..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            px-6
            py-4
            outline-none
            focus:border-orange-500
            transition
          "
        />

        <select
          value={selectedSeason}
          onChange={(e) =>
            setSelectedSeason(e.target.value)
          }
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            px-6
            py-4
            outline-none
            focus:border-orange-500
            transition
          "
        >  
            <option value="all">
                Все игроки
            </option>
          {seasons.map((season) => (
            
            
            <option
              key={season.id}
              value={season.name}
            >
              {season.name}
            </option>

            
          ))}
        </select>
      </div>
    </div>
  )
}