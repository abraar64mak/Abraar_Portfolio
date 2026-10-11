export default function SectionHead({ tag, title, accent, className = '' }: { tag: string; title: string; accent: string; className?: string }) {
  return (
    <div className={className}>
      <p className="tag rv mb-5">{tag}</p>
      <h2 className="h2">
        <span className="rv-mask"><span>{title}</span></span>
        <span className="rv-mask" style={{ ['--i' as string]: 1 }}><span><em>{accent}</em></span></span>
      </h2>
    </div>
  )
}
