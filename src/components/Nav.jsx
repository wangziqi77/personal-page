import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang.jsx'

const SECTIONS = ['about', 'experience', 'education', 'projects', 'explore']

export default function Nav() {
  const { t, lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      if (!isHome) return
      // Track active section
      for (const id of [...SECTIONS].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => { setMenuOpen(false) }, [location])

  function scrollTo(id) {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  const navItems = [
    { id: 'experience', label: t.nav.experience },
    { id: 'projects',   label: t.nav.projects },
    { id: 'explore',    label: t.nav.explore },
  ]

  const btnClass = (id) =>
    `text-sm font-medium transition-colors duration-200 px-1 py-0.5
     relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-navy-600
     after:transition-all after:duration-300
     ${isHome && activeSection === id
       ? 'text-navy-700 after:w-full'
       : 'text-navy-400 hover:text-navy-700 after:w-0 hover:after:w-full'}`

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-cream-100/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo('about')}
          className="text-navy-700 font-bold text-lg tracking-tight hover:text-navy-500 transition-colors"
        >
          Wang<span className="text-navy-500">.</span>
        </button>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)} className={btnClass(id)}>
              {label}
            </button>
          ))}
          <button
            onClick={toggle}
            className="ml-1 px-3 py-1 rounded-full border border-navy-400/40 text-xs font-semibold
                       text-navy-500 hover:bg-navy-700 hover:text-cream-50 hover:border-navy-700
                       transition-all duration-200"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggle}
            className="px-3 py-1 rounded-full border border-navy-400/40 text-xs font-semibold
                       text-navy-500 hover:bg-navy-700 hover:text-cream-50 transition-all duration-200"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <button onClick={() => setMenuOpen(o => !o)} className="text-navy-600 p-1">
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-cream-100/98 backdrop-blur-sm border-t border-cream-300 px-6 py-5 flex flex-col gap-5">
          {navItems.map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-left text-navy-600 font-medium hover:text-navy-800 transition-colors">
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
