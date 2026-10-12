/** Heartbeat rings and ground shadow shared by the video and the animated-photo versions of the hero. */
export default function HeroHalo() {
  return (
    <>
      <span aria-hidden className="absolute bottom-[26%] left-1/2 aspect-square h-[46%] -translate-x-1/2 animate-ring rounded-full border border-ink/10" />
      <span aria-hidden className="absolute bottom-[26%] left-1/2 aspect-square h-[46%] -translate-x-1/2 animate-ring rounded-full border border-ink/10" style={{ animationDelay: '1.2s' }} />
      <span aria-hidden className="absolute bottom-[1.5%] left-1/2 h-[3.5%] w-[62%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-xl" />
    </>
  )
}
