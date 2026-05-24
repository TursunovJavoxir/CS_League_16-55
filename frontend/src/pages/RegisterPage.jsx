import { useState } from "react"
import { apiFetch } from "../utils/api"
import {
  Link,
  useNavigate
} from "react-router-dom"

import Button from "../components/ui/Button"
import Card from "../components/ui/Card"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    try {
      const response = await apiFetch(
        "/auth/register",
        {
          method: "POST",

          

          body: JSON.stringify({
            nickname,
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || "Ошибка регистрации")

        return
      }

      setSuccess("Аккаунт создан")

      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch {
      setError("Ошибка сервера")
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden text-white">

      {/* BACKGROUND GLOW */}

      <div className="
        fixed
        top-[-200px]
        left-[-200px]
        w-[500px]
        h-[500px]
        rounded-full
        bg-orange-500/10
        blur-[160px]
      " />

      <div className="
        fixed
        bottom-[-200px]
        right-[-200px]
        w-[500px]
        h-[500px]
        rounded-full
        bg-purple-500/10
        blur-[160px]
      " />

      <div className="
        relative
        z-10
        min-h-screen
        grid
        xl:grid-cols-2
      ">

        {/* LEFT SIDE */}

        <div className="
          hidden
          xl:flex
          flex-col
          justify-between
          p-16
          border-r
          border-slate-800
        ">

          <div>

            <div className="inline-flex items-center gap-4 mb-10">

              <div className="
                w-16
                h-16
                rounded-3xl
                bg-gradient-to-br
                from-orange-500
                to-red-600
                flex
                items-center
                justify-center
                text-2xl
                font-black
                shadow-[0_0_40px_rgba(249,115,22,0.3)]
              ">
                CS
              </div>

              <div>
                <div className="text-3xl font-black">
                  CS LEAGUE
                </div>

                <div className="
                  text-orange-400
                  uppercase
                  tracking-[0.3em]
                  text-xs
                  mt-1
                ">
                  Competitive Platform
                </div>
              </div>

            </div>

            <div className="
              uppercase
              tracking-[0.35em]
              text-orange-400
              text-sm
              mb-6
            ">
              Новый игрок
            </div>

            <h1 className="
              text-7xl
              font-black
              leading-[0.95]
              mb-8
            ">
              СОЗДАЙ
              <br />
              ПРОФИЛЬ
            </h1>

            <div className="
              text-2xl
              text-slate-400
              leading-relaxed
              max-w-[700px]
            ">
              Начни путь в CS League:
              пройди калибровку,
              получи ранг,
              играй матчи
              и поднимайся в рейтинге.
            </div>

          </div>

          <div className="grid grid-cols-3 gap-4">

            <Card className="p-5" hover={false}>
              <div className="text-slate-500 text-sm">
                Старт
              </div>

              <div className="text-xl font-black mt-2">
                Placement
              </div>
            </Card>

            <Card className="p-5" hover={false}>
              <div className="text-slate-500 text-sm">
                Рейтинг
              </div>

              <div className="text-xl font-black mt-2 text-orange-400">
                ELO
              </div>
            </Card>

            <Card className="p-5" hover={false}>
              <div className="text-slate-500 text-sm">
                Турниры
              </div>

              <div className="text-xl font-black mt-2 text-cyan-300">
                LIVE
              </div>
            </Card>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="
          flex
          items-center
          justify-center
          p-6
          md:p-10
        ">

          <Card
            glow
            className="
              w-full
              max-w-xl
              p-8
              md:p-10
            "
          >

            <div className="mb-10">

              <div className="
                uppercase
                tracking-[0.35em]
                text-orange-400
                text-sm
                mb-4
              ">
                Регистрация
              </div>

              <h1 className="
                text-5xl
                font-black
                mb-4
              ">
                Новый аккаунт
              </h1>

              <div className="text-slate-400 text-lg">
                Создайте профиль игрока для участия в рейтинге и турнирах.
              </div>

            </div>

            <form
              onSubmit={handleRegister}
              className="space-y-6"
            >

              <div>
                <label className="block text-slate-300 mb-3 font-bold">
                  Никнейм
                </label>

                <input
                  type="text"
                  value={nickname}
                  onChange={(e) =>
                    setNickname(e.target.value)
                  }
                  className="
                    w-full
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    px-5
                    py-4
                    text-white
                    outline-none
                    transition
                    focus:border-orange-500
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-3 font-bold">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="
                    w-full
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    px-5
                    py-4
                    text-white
                    outline-none
                    transition
                    focus:border-orange-500
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-3 font-bold">
                  Пароль
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="
                    w-full
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    px-5
                    py-4
                    text-white
                    outline-none
                    transition
                    focus:border-orange-500
                  "
                  required
                />
              </div>

              {error && (
                <div className="
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  p-4
                  text-red-300
                  font-semibold
                ">
                  {error}
                </div>
              )}

              {success && (
                <div className="
                  rounded-2xl
                  border
                  border-green-500/20
                  bg-green-500/10
                  p-4
                  text-green-300
                  font-semibold
                ">
                  {success}
                </div>
              )}

              <Button
                type="submit"
                className="
                  w-full
                  py-4
                  text-lg
                "
              >
                СОЗДАТЬ АККАУНТ
              </Button>

            </form>

            <div className="
              mt-8
              pt-8
              border-t
              border-slate-800
              text-center
            ">

              <div className="text-slate-400 mb-4">
                Уже есть аккаунт?
              </div>

              <Link to="/login">
                <Button
                  variant="secondary"
                  className="w-full"
                >
                  ВОЙТИ В АККАУНТ
                </Button>
              </Link>

            </div>

          </Card>

        </div>

      </div>

    </div>
  )
}