export default function AdminPanelCard({
  children,
  color = "orange"
}) {
  const styles = {
    orange: `
      border-orange-500/20
      shadow-[0_0_45px_rgba(249,115,22,0.08)]
    `,
    purple: `
      border-purple-500/20
      shadow-[0_0_40px_rgba(168,85,247,0.08)]
    `,
    slate: `
      border-slate-800
      shadow-2xl
    `
  }

  return (
    <div
      className={`
        rounded-3xl
        border
        bg-gradient-to-br
        from-slate-900
        to-slate-950
        ${styles[color] || styles.slate}
      `}
    >
      {children}
    </div>
  )
}