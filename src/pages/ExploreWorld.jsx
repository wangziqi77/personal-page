import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang.jsx'
import WorldMap from '../components/WorldMap'
import { visitedCountries } from '../data/visitedCountries'

export default function ExploreWorld() {
  const { lang } = useLang()
  const isZh = lang === 'zh'

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/"
        className="inline-flex items-center gap-2 text-navy-400 hover:text-navy-600 text-sm mb-10 transition-colors group"
        state={{ scrollTo: 'explore' }}
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        {isZh ? '返回主页' : 'Back to Home'}
      </Link>

      <div className="mb-10">
        <p className="text-navy-400/50 text-sm font-mono tracking-widest mb-2">Explore Me</p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy-700 mb-3">
          {isZh ? '环游世界足迹' : 'World Footprint'}
        </h1>
        <p className="text-navy-400 text-base">
          {isZh ? '走过的土地，留下的故事' : 'Lands traveled, stories collected'}
        </p>
      </div>

      {/* Map */}
      <div className="mb-16">
        <WorldMap />
      </div>

      {/* Country list */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-navy-700 mb-6">
          {isZh ? '每一段旅途' : 'Every Journey'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visitedCountries.map(c => (
            <div
              key={c.iso3}
              className="flex gap-4 p-4 rounded-xl border border-cream-300 bg-cream-50
                         hover:border-navy-400/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
              <div>
                <h4 className="text-navy-700 font-semibold text-sm mb-1">
                  {isZh ? c.nameZh : c.nameEn}
                </h4>
                <p className="text-navy-400 text-xs leading-relaxed">
                  {isZh ? c.textZh : c.textEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
