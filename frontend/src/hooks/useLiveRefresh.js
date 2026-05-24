import {
  useEffect,
  useRef
} from "react"

export default function useLiveRefresh(
  callback,
  delay = 15000
) {

  const savedCallback =
    useRef(callback)

  useEffect(() => {

    savedCallback.current =
      callback

  }, [callback])

  useEffect(() => {

    savedCallback.current()

    const interval = setInterval(() => {

      savedCallback.current()

    }, delay)

    return () => {

      clearInterval(interval)

    }

  }, [delay])

}