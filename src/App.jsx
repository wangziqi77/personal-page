import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import ExploreHobbies from './pages/ExploreHobbies'
import ExploreWorld from './pages/ExploreWorld'

export default function App() {
  useEffect(() => {
    const base = import.meta.env.BASE_URL
    const style = document.createElement('style')
    style.id = 'custom-cursor'
    style.textContent = `* { cursor: url('${base}images/cursor_small.GIF') 29 34, auto !important; }`
    document.head.appendChild(style)
    return () => document.getElementById('custom-cursor')?.remove()
  }, [])

  return (
    <HashRouter>
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/explore/hobbies" element={<ExploreHobbies />} />
            <Route path="/explore/world" element={<ExploreWorld />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
