import { translateRank } from "../../utils/translations"
import Button from "../ui/Button"
import Card from "../ui/Card"

export default function PlacementRevealModal({
  player,
  revealRank,
  revealElo,
  revealContinue,
  onClose
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]

        flex
        items-center
        justify-center

        bg-black/70
        backdrop-blur-md

        px-4
      "
    >
      <Card
        glow
        className="
          w-full
          max-w-2xl
          p-10
          md:p-12
          text-center
          border-yellow-500/30
          shadow-[0_0_80px_rgba(234,179,8,0.25)]
        "
      >
        <div className="text-8xl mb-6">
          🏆
        </div>

        <div
          className="
            uppercase
            tracking-[0.35em]
            text-yellow-400
            text-sm
            mb-4
          "
        >
          Competitive Calibration
        </div>

        <h1
          className="
            text-5xl
            md:text-6xl
            font-black
            mb-8
          "
        >
          КАЛИБРОВКА
          <br />
          ЗАВЕРШЕНА
        </h1>

        <div className="text-3xl text-gray-300 mb-5">
          Итоговый ранг
        </div>

        {revealRank && (
          <div
            className="
              text-6xl
              md:text-7xl
              font-black
              text-yellow-400
              mb-8
              animate-pulse
            "
          >
            {translateRank(player?.rank)}
          </div>
        )}

        {revealElo && (
          <div
            className="
              text-5xl
              font-black
              text-green-400
              mb-10
              animate-pulse
            "
          >
            {player?.elo} ELO
          </div>
        )}

        <div
          className="
            flex
            justify-center
            gap-10
            mb-10
          "
        >
          <div>
            <div className="text-green-400 text-5xl font-black">
              {player?.wins}
            </div>

            <div className="text-gray-400">
              Побед
            </div>
          </div>

          <div>
            <div className="text-red-400 text-5xl font-black">
              {player?.losses}
            </div>

            <div className="text-gray-400">
              Поражений
            </div>
          </div>
        </div>

        {revealContinue && (
          <Button
            onClick={onClose}
            variant="primary"
            className="
              px-10
              py-4
              text-xl
              animate-pulse
            "
          >
            ПРОДОЛЖИТЬ
          </Button>
        )}
      </Card>
    </div>
  )
}