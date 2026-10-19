/** A calm, endlessly drawing ECG trace. Pure SVG + CSS. */
const beat = (x: number) =>
  `L${x + 60} 60 Q${x + 78} 38 ${x + 96} 60 L${x + 120} 60 L${x + 130} 70 L${x + 142} 6 L${x + 154} 100 L${x + 164} 60 L${x + 200} 60 Q${x + 235} 28 ${x + 270} 60 L${x + 340} 60 `
export default function EcgLine({ className = '' }: { className?: string }) {
  const d = 'M0 60 ' + [0, 340, 680, 1020, 1360, 1700, 2040].map(beat).join('')
  return (
    <svg viewBox="0 0 2400 120" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={d} fill="none" stroke="#0d0d0d" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" className="ecg-draw" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
