import { useCallback, useEffect, useState } from 'react'

export const VIEWS = ['overview', 'log', 'research', 'lab', 'skills', 'papers', 'contact'] as const
export type View = (typeof VIEWS)[number]
export interface Route { view: View; id?: string }

const parse = (): Route => {
  const [, v, id] = window.location.hash.match(/^#\/([a-z]+)(?:\/(.+))?$/) ?? []
  const view = (VIEWS as readonly string[]).includes(v) ? (v as View) : 'overview'
  return { view, id: id ? decodeURIComponent(id) : undefined }
}

/** Hash routing: #/research/beatnet. No overlays, so nothing can get "stuck" open. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = useCallback((view: View, id?: string) => {
    window.location.hash = `/${view}${id ? '/' + encodeURIComponent(id) : ''}`
  }, [])
  return { route, go }
}
