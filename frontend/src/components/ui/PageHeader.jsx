export default function PageHeader({
  title,
  subtitle,
  rightContent,
  centered = false
}) {
  return (
    <div
      className={`
        flex
        flex-col
        gap-6

        md:flex-row
        md:items-end
        md:justify-between

        mb-10

        ${centered ? "text-center items-center" : ""}
      `}
    >
      {/* LEFT */}

      <div>

        <div className="flex items-center gap-4">

          <div
            className="
              w-2
              h-14

              rounded-full

              bg-orange-500

              shadow-[0_0_25px_rgba(249,115,22,0.8)]
            "
          />

          <div>

            <h1
              className="
                text-4xl
                md:text-6xl

                font-black

                tracking-tight

                text-white
              "
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className="
                  mt-2
                  text-slate-400
                  text-base
                  md:text-lg
                "
              >
                {subtitle}
              </p>
            )}

          </div>

        </div>

      </div>

      {/* RIGHT */}

      {rightContent && (
        <div>
          {rightContent}
        </div>
      )}

    </div>
  )
}