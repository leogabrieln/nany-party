import { NavLink, Link } from 'react-router-dom'
import { Camera, Disc3, Gamepad2, Heart, Menu, X, Images, StickyNote } from 'lucide-react'
import { useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { experiences, img } from '../data'

const icons = [StickyNote, Gamepad2, Camera, Disc3, Images]

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <header className="topbar">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={img('convite/star1.png')} alt="" className="brand-star" />
          <span>NANY<b>·</b>FESTA</span>
        </Link>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav-links is-open' : 'nav-links'}>
          {experiences.map((item, i) => {
            const Icon = icons[i]
            return (
              <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <Icon size={15} /><span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        {/* <span>FEITO COM <Heart size={12} fill="currentColor" /> PARA A NANY</span> */}
        {/* <span>CURTA A FESTA</span> */}
      </footer>
    </div>
  )
}
