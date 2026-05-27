import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { apiFetch } from "../utils/api"

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    isAuthenticated,
    isAdmin,
    currentPlayer,
    logout
  } = useAuth()

  const authenticated = isAuthenticated
  const admin = isAdmin
  const nickname = currentPlayer?.nickname

  const [playerId, setPlayerId] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!nickname) return

    apiFetch(`/players/nickname/${nickname}`)
      .then(res => res.json())
      .then(data => {
        setPlayerId(data.id)
      })
      .catch(() => {
        setPlayerId(null)
      })
  }, [nickname])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navItems = [
    { name: "Главная", path: "/" },
    { name: "Рейтинг", path: "/leaderboard" },
    { name: "Матчи", path: "/matches" },
    { name: "Калибровка", path: "/placement" },
    { name: "Турниры", path: "/tournaments" },
    { name: "Игроки", path: "/players" },
    { name: "«Зал Славы»", path: "/hall-of-fame" }
  ]

  if (admin) {
    navItems.push({
      name: "Админ",
      path: "/admin"
    })
  }

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }

    return location.pathname.startsWith(path)
  }

  return (
    <header className="
      sticky top-0 z-[999]
      border-b border-slate-800/80
      bg-[#020617]/85
      backdrop-blur-2xl
      shadow-[0_10px_40px_rgba(0,0,0,0.35)]
    ">
      <div className="max-w-[1800px] mx-auto px-5 md:px-10">
        <div className="h-20 flex items-center justify-between gap-6">

          {/* LOGO */}

          <Link to="/" className="flex items-center gap-4 group">
            <div className="
              relative w-12 h-12 rounded-2xl
              bg-gradient-to-br from-orange-500 to-red-600
              flex items-center justify-center
              shadow-[0_0_35px_rgba(249,115,22,0.35)]
              group-hover:scale-105
              transition
            ">
              <div className="absolute inset-0 rounded-2xl bg-white/10" />
              <span className="relative text-white font-black text-xl">
                CS
              </span>
            </div>

            <div>
              <div className="text-white text-2xl font-black leading-none tracking-tight">
                CS LEAGUE
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-orange-400 mt-1">
                16:55 отчёт тайм!!!
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}

          <nav className="hidden xl:flex items-center gap-2">
            {navItems.map((item) => {
              const active = isActive(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-3 rounded-2xl
                    text-sm font-bold
                    transition-all duration-300
                    ${
                      active
                        ? "text-orange-400 bg-orange-500/10 border border-orange-500/20 shadow-[0_0_25px_rgba(249,115,22,0.12)]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {item.name}

                  {active && (
                    <span className="
                      absolute left-1/2 -bottom-[2px]
                      -translate-x-1/2
                      w-8 h-[2px]
                      rounded-full
                      bg-orange-400
                      shadow-[0_0_14px_rgba(251,146,60,0.9)]
                    " />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            <div className="
              hidden lg:flex items-center gap-3
              px-4 py-3 rounded-2xl
              border border-emerald-500/20
              bg-emerald-500/10
            ">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-bold text-emerald-300">
                LIVE SEASON
              </span>
            </div>

            {!authenticated && (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="
                    px-5 py-3 rounded-2xl
                    border border-slate-700
                    bg-white/5
                    hover:bg-white/10
                    hover:border-orange-500/30
                    text-slate-200
                    font-bold
                    transition
                  "
                >
                  Войти
                </Link>

                <Link
                  to="/register"
                  className="
                    px-5 py-3 rounded-2xl
                    bg-orange-500
                    hover:bg-orange-400
                    text-white
                    font-black
                    shadow-[0_0_30px_rgba(249,115,22,0.25)]
                    transition
                  "
                >
                  Создать аккаунт
                </Link>
              </div>
            )}

            {authenticated && playerId && (
              <Link
                to={`/players/${playerId}`}
                className="
                  hidden md:flex items-center gap-4
                  px-4 py-3 rounded-2xl
                  bg-white/5
                  border border-slate-700
                  hover:border-orange-500/40
                  hover:bg-white/10
                  transition
                "
              >
                <div className="
                  w-11 h-11 rounded-xl
                  bg-gradient-to-br from-orange-500 to-red-600
                  flex items-center justify-center
                  font-black text-white
                ">
                  {nickname?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <div className="text-white font-bold leading-tight">
                    {nickname}
                  </div>
                  <div className="text-xs text-emerald-400 font-bold">
                    ONLINE
                  </div>
                </div>
              </Link>
            )}

            {authenticated && (
              <button
                onClick={handleLogout}
                className="
                  hidden md:block
                  px-5 py-3 rounded-2xl
                  bg-red-500/10
                  border border-red-500/20
                  hover:bg-red-500/20
                  text-red-300
                  font-bold
                  transition
                "
              >
                Выйти
              </button>
            )}

            {/* MOBILE BUTTON */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="
                xl:hidden
                w-12 h-12 rounded-2xl
                bg-white/5
                border border-slate-700
                hover:border-orange-500/40
                flex items-center justify-center
                transition
              "
            >
              <span className="text-white text-2xl font-black">
                {mobileOpen ? "×" : "☰"}
              </span>
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}

        {mobileOpen && (
          <div className="
            xl:hidden
            pb-6
            border-t border-slate-800
          ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5">
              {navItems.map((item) => {
                const active = isActive(item.path)

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      px-5 py-4 rounded-2xl
                      font-bold
                      border
                      transition
                      ${
                        active
                          ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                          : "bg-white/5 text-slate-300 border-slate-800 hover:bg-white/10"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">

              {!authenticated && (
                <>
                  <Link
                    to="/login"
                    className="
                      flex-1 text-center
                      px-5 py-4 rounded-2xl
                      bg-white/5
                      border border-slate-700
                      text-slate-200
                      font-bold
                    "
                  >
                    Войти
                  </Link>

                  <Link
                    to="/register"
                    className="
                      flex-1 text-center
                      px-5 py-4 rounded-2xl
                      bg-orange-500
                      text-white
                      font-black
                    "
                  >
                    Создать аккаунт
                  </Link>
                </>
              )}

              {authenticated && playerId && (
                <Link
                  to={`/players/${playerId}`}
                  className="
                    flex-1
                    px-5 py-4 rounded-2xl
                    bg-white/5
                    border border-slate-700
                    text-white
                    font-bold
                  "
                >
                  Профиль: {nickname}
                </Link>
              )}

              {authenticated && (
                <button
                  onClick={handleLogout}
                  className="
                    flex-1
                    px-5 py-4 rounded-2xl
                    bg-red-500/10
                    border border-red-500/20
                    text-red-300
                    font-bold
                  "
                >
                  Выйти
                </button>
              )}

            </div>
          </div>
        )}

      </div>
    </header>
  )
}