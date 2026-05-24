import CreateTournamentForm from "../components/CreateTournamentForm"
import TournamentParticipantsManager from "../components/TournamentParticipantsManager"
import TournamentActionsPanel from "../components/TournamentActionsPanel"
import MatchControlPanel from "../components/MatchControlPanel"

import AdminPanelCard from "../components/admin/AdminPanelCard"
import AdminSectionTitle from "../components/admin/AdminSectionTitle"
import TournamentParticipantsViewer from "../components/admin/TournamentParticipantsViewer"
import TournamentQuickStats from "../components/admin/TournamentQuickStats"
import SeasonAdminPanel from "../components/admin/SeasonAdminPanel"


export default function AdminPage() {
  return (
    <div className="p-6 lg:p-8 text-white">

      {/* HERO */}

      
      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          via-[#081226]
          to-slate-950
          p-8
          lg:p-10
          mb-10
          shadow-2xl
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_35%)]
            pointer-events-none
          "
        />

        <div className="relative z-10">
          <div
            className="
              text-orange-400
              uppercase
              tracking-[0.35em]
              text-xs
              font-black
              mb-4
            "
          >
            Tournament Administration
          </div>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-black
              text-white
              mb-5
            "
          >
            Tournament Control Center
          </h1>

          <div
            className="
              text-slate-400
              text-lg
              max-w-3xl
            "
          >
            Управление турнирами, матчами и competitive ecosystem платформы
          </div>
        </div>
      </div>

      {/* SETUP SECTION */}

      <div className="mb-10">
        <AdminSectionTitle
          title="Tournament Setup"
          color="purple"
        />

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-8
          "
        >
          <AdminPanelCard color="purple">
            <CreateTournamentForm />
          </AdminPanelCard>

          <AdminPanelCard color="purple">
            <TournamentParticipantsManager />
          </AdminPanelCard>

          <AdminPanelCard color="purple">
            <TournamentParticipantsViewer />
          </AdminPanelCard>
        </div>
      </div>

      {/* LIVE CONTROL */}

      <div className="mb-10">
        <AdminSectionTitle
          title="Live Tournament Control"
          color="orange"
        />

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-8
          "
        >
          <AdminPanelCard color="orange">
            <TournamentActionsPanel />
          </AdminPanelCard>

          <AdminPanelCard color="orange">
            <MatchControlPanel />
          </AdminPanelCard>
        </div>
      </div>



      {/* Season control */}
      <div className="mb-10">
        <AdminSectionTitle
          title="Season Control"
          color="green"
        />

        <AdminPanelCard color="slate">
          <SeasonAdminPanel />
        </AdminPanelCard>
      </div>
      {/* PLATFORM STATUS */}

      <div>
        <AdminSectionTitle
          title="Platform Status"
          color="green"
        />

        <AdminPanelCard color="slate">
          <div className="p-8">
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
              "
            >
              <StatusCard
                title="Platform Status"
                value="ONLINE"
                color="green"
              />

              <StatusCard
                title="Backend API"
                value="CONNECTED"
                color="blue"
              />

              <StatusCard
                title="Tournament Engine"
                value="ACTIVE"
                color="orange"
              />
            </div>
          </div>
        </AdminPanelCard>

        <div className="mt-8">
          <AdminPanelCard color="slate">
            <TournamentQuickStats />
          </AdminPanelCard>
        </div>
      </div>
    </div>
  )
}

function StatusCard({
  title,
  value,
  color
}) {
  const styles = {
    green: "border-green-500/20 bg-green-500/10 text-green-400",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    orange: "border-orange-500/20 bg-orange-500/10 text-orange-400"
  }

  return (
    <div
      className={`
        rounded-2xl
        border
        p-6
        ${styles[color] || styles.green}
      `}
    >
      <div className="text-slate-400 mb-2">
        {title}
      </div>

      <div className="text-3xl font-black">
        {value}
      </div>
    </div>
  )
}