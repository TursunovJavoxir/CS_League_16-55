import {

  createContext,
  useContext,
  useEffect,
  useState

} from "react"

const AuthContext =
  createContext()

export function AuthProvider({

  children

}) {

  const [token, setToken] =
    useState(

      localStorage.getItem("token")
    )

  const [role, setRole] =
    useState(

      localStorage.getItem("role")
    )

  const [currentPlayer, setCurrentPlayer] =
    useState(() => {

      const saved =
        localStorage.getItem("player")

      return saved
        ? JSON.parse(saved)
        : null
    })

  const login = ({

    token,
    player

  }) => {

    localStorage.setItem(
      "token",
      token
    )

    localStorage.setItem(
      "role",
      player.role
    )

    localStorage.setItem(
      "player",
      JSON.stringify(player)
    )

    setToken(token)

    setRole(player.role)

    setCurrentPlayer(player)
  }

  const logout = () => {

    localStorage.clear()

    setToken(null)

    setRole(null)

    setCurrentPlayer(null)
  }

  useEffect(() => {

    const savedPlayer =
      localStorage.getItem("player")

    if (savedPlayer) {

      setCurrentPlayer(
        JSON.parse(savedPlayer)
      )
    }

  }, [])

  return (

    <AuthContext.Provider
      value={{

        token,

        role,

        currentPlayer,

        isAuthenticated:
          !!token,

        isAdmin:
          role === "admin",

        login,

        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

export function useAuth() {

  return useContext(
    AuthContext
  )
}