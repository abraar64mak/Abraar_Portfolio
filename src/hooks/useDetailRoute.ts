import { useCallback, useEffect, useState } from 'react'

export type DetailKind = 'experience' | 'project'
export interface DetailRoute { kind: DetailKind; id: string }

const parse = (): DetailRoute | null => {
  const m = window.location.hash.match(/^#\/(experience|project)\/([\w-]+)$/)
  return m ? { kind: m[1] as DetailKind, id: m[2] } : null
}

/** Deep-linkable detail views: #/project/beatnet, #/experience/cdf */
export function useDetailRoute() {
  const [route, setRoute] = useState<DetailRoute | null>(() => (typeof window === 'undefined' ? null : parse()))

  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const open = useCallback((kind: DetailKind, id: string) => {
    window.history.pushState(null, '', `#/${kind}/${id}`)
    setRoute({ kind, id })
  }, [])

  const close = useCallback(() => {
    if (window.location.hash.startsWith('#/')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search)
    }
    setRoute(null)
  }, [])

  return { route, open, close }
}
