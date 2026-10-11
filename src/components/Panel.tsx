import type { ReactNode } from 'react'

interface Props { title?: string; tag?: string; right?: ReactNode; children: ReactNode; className?: string; bodyClass?: string; hover?: boolean }

export default function Panel({ title, tag, right, children, className = '', bodyClass = 'p-5', hover }: Props) {
  return (
    <section className={`panel ${hover ? 'panel-hover' : ''} ${className}`}>
      {(title || tag || right) && (
        <header className="flex items-center justify-between gap-3 border-b border-cyan-300/10 px-5 py-3">
          <div className="min-w-0">
            {tag && <p className="mono-label truncate">{tag}</p>}
            {title && <h2 className="truncate text-[15px] font-semibold text-white">{title}</h2>}
          </div>
          {right}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}
