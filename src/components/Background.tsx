/** Fixed ambient layer: grid, aurora glows, slow scanline. Pure CSS, no JS cost. */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-32 top-[-10%] h-[520px] w-[520px] animate-float rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="absolute -right-24 top-[30%] h-[460px] w-[460px] animate-float rounded-full bg-teal-400/10 blur-[120px]" style={{ animationDelay: '-4s' }} />
      <div className="absolute inset-x-0 top-0 h-40 animate-scan bg-gradient-to-b from-transparent via-cyan-300/[0.03] to-transparent" />
    </div>
  )
}
