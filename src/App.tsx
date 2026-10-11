import { useEffect } from 'react'
import About from './components/About'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Hero from './components/Hero'
import Lab from './components/Lab'
import Nav from './components/Nav'
import Skills from './components/Skills'
import Work from './components/Work'
import { initScroll } from './lib/scroll'

export default function App() {
  useEffect(() => initScroll(), [])

  // global reveal-on-scroll: adds .is-in to .rv / .rv-mask once
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    const scan = () => document.querySelectorAll('.rv:not(.is-in), .rv-mask:not(.is-in)').forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Lab />
        <Experience />
        <Achievements />
        <Contact />
      </main>
    </>
  )
}
