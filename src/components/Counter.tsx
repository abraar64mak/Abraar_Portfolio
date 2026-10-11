import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props { from?: number; to: number; decimals?: number; suffix?: string }

export default function Counter({ from = 0, to, decimals = 0, suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(from)

  useEffect(() => {
    if (!inView) return
    const c = animate(from, to, { duration: 1.6, ease: 'easeOut', onUpdate: setVal })
    return () => c.stop()
  }, [inView, from, to])

  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>
}
