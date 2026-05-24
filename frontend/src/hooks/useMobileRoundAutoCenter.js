import { useEffect } from "react"

export default function useMobileRoundAutoCenter({
  containerRef,
  roundRefs,
  activeRound
}) {
  useEffect(() => {
    const container =
      containerRef.current

    const activeElement =
      roundRefs.current[activeRound]

    if (!container || !activeElement) return

    const isMobile =
      window.innerWidth < 768

    if (!isMobile) return

    const timeout =
      setTimeout(() => {
        const containerWidth =
          container.clientWidth

        const scrollPosition =
          activeElement.offsetLeft -
          containerWidth / 2 +
          activeElement.clientWidth / 2

        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth"
        })
      }, 250)

    return () => clearTimeout(timeout)
  }, [containerRef, roundRefs, activeRound])
}