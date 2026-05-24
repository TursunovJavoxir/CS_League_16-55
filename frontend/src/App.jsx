import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"

import LeaderboardPage from "./pages/LeaderboardPage"
import TournamentsPage from "./pages/TournamentsPage"
import TournamentDetailsPage from "./pages/TournamentDetailsPage"
import PlayersPage from "./pages/PlayersPage"
import LoginPage from "./pages/LoginPage"
import PlayerProfilePage from "./pages/PlayerProfilePage"
import RegisterPage from "./pages/RegisterPage"
import AdminPage from "./pages/AdminPage"
import MatchesPage from "./pages/MatchesPage"
import HomePage from "./pages/HomePage"
import HallOfFamePage from "./pages/HallOfFamePage"
import PlacementPage from "./pages/PlacementPage"
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"
import MatchVetoPage from "./pages/MatchVetoPage"


export default function App() {

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-slate-900">

        <Navbar />

        <Routes>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/leaderboard"
            element={<LeaderboardPage />}
          />

          <Route
            path="/matches"
            element={<MatchesPage />}
          />

          <Route
            path="/matches/:id/veto"
            element={<MatchVetoPage />}
          />

          <Route
            path="/tournaments"
            element={<TournamentsPage />}
          />

          <Route
            path="/tournaments/:id"
            element={<TournamentDetailsPage />}
          />

          <Route
            path="/players"
            element={<PlayersPage />}
          />

          <Route
            path="/hall-of-fame"
            element={<HallOfFamePage />}
          />

          <Route
            path="/placement"
            element={<PlacementPage />}
          />

          <Route
            path="/players/:id"
            element={<PlayerProfilePage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>

                <AdminPage />

              </ProtectedAdminRoute>
            }
          />

        </Routes>

      </div>

    </BrowserRouter>
  )
}