import { useState, useEffect, useRef, useCallback } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { visitedCountries } from '../data/visitedCountries'
import { useLang } from '../hooks/useLang.jsx'

// 50m topology uses zero-padded string IDs e.g. "156", "056"
const ISO3_BY_NUMID = {
  '156': 'CHN', '392': 'JPN', '410': 'KOR', '124': 'CAN',
  '484': 'MEX', '188': 'CRI', '208': 'DNK', '752': 'SWE',
  '578': 'NOR', '352': 'ISL', '234': 'FRO', '528': 'NLD', '056': 'BEL',
  '250': 'FRA', '756': 'CHE', '380': 'ITA',
}

export default function WorldMap() {
  const { lang } = useLang()
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [countries, setCountries] = useState([])
  const [tooltip, setTooltip] = useState(null)
  const [dims, setDims] = useState({ w: 800, h: 416 })

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}map/world-50m.json`)
      .then(r => r.json())
      .then(topo => setCountries(feature(topo, topo.objects.countries).features))
      .catch(err => console.error('Map load failed:', err))
  }, [])

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      setDims({ w, h: Math.round(w * 0.52) })
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const projection = geoNaturalEarth1()
    .scale(dims.w / 6.2)
    .translate([dims.w / 2, dims.h / 2])

  const pathGen = geoPath().projection(projection)

  const getVisited = useCallback((f) => {
    const id = String(f.id).padStart(3, '0')
    const iso3 = ISO3_BY_NUMID[id]
    return iso3 ? visitedCountries.find(c => c.iso3 === iso3) : null
  }, [])

  const onMove = useCallback((e, f) => {
    const data = getVisited(f)
    if (!data) return
    const rect = svgRef.current.getBoundingClientRect()
    setTooltip({ data, x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [getVisited])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Legend */}
      <div className="flex items-center gap-5 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#A8C5DA]" />
          <span className="text-navy-500 text-sm">
            {lang === 'zh' ? `已到访 ${visitedCountries.length} 个国家/地区` : `${visitedCountries.length} Countries Visited`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#dde6dd]" />
          <span className="text-navy-400 text-sm">{lang === 'zh' ? '未到访' : 'Not visited'}</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-cream-300">
        <svg ref={svgRef} width={dims.w} height={dims.h} className="block">
          <rect width={dims.w} height={dims.h} fill="#e8eff5" />
          {countries.map((f, i) => {
            const visited = getVisited(f)
            const d = pathGen(f)
            if (!d) return null
            return (
              <path
                key={i} d={d}
                fill={visited ? visited.color : '#dde8de'}
                stroke="#fff" strokeWidth={0.4}
                className={visited ? 'cursor-pointer' : ''}
                style={{ filter: tooltip && visited && tooltip.data.iso3 === visited.iso3 ? 'brightness(1.1)' : 'none' }}
                onMouseMove={visited ? e => onMove(e, f) : undefined}
                onMouseLeave={visited ? () => setTooltip(null) : undefined}
              />
            )
          })}
        </svg>
      </div>

      {tooltip && (
        <MapTooltip
          data={tooltip.data} x={tooltip.x} y={tooltip.y}
          lang={lang} mapW={dims.w} mapH={dims.h}
        />
      )}

      <p className="text-navy-400/50 text-xs mt-3 text-center">
        {lang === 'zh' ? '悬停在彩色国家上查看故事' : 'Hover over a colored country to see the story'}
      </p>
    </div>
  )
}

function MapTooltip({ data, x, y, lang, mapW, mapH }) {
  const isZh = lang === 'zh'
  const flipX = x > mapW * 0.58
  const flipY = y > mapH * 0.55

  return (
    <div
      className="absolute z-20 bg-white rounded-xl shadow-xl border border-cream-300 overflow-hidden"
      style={{
        pointerEvents: 'none',
        maxWidth: 260,
        left: flipX ? 'auto' : x + 12,
        right: flipX ? mapW - x + 12 : 'auto',
        top: flipY ? 'auto' : y + 8,
        bottom: flipY ? mapH - y + 8 : 'auto',
      }}
    >
      <div className="px-4 py-2.5 font-semibold text-sm text-navy-700"
        style={{ background: data.color + '40', borderBottom: `2px solid ${data.color}` }}>
        {isZh ? data.nameZh : data.nameEn}
      </div>
      <div className="grid grid-cols-2 gap-0.5 p-0.5">
        {data.photos.slice(0, 4).map((photo, i) => (
          <div key={i} className="aspect-video bg-cream-200 rounded overflow-hidden flex items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}images/${photo}`}
              alt=""
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; e.target.parentElement.textContent = '🏔️' }}
            />
          </div>
        ))}
      </div>
      <div className="px-4 py-3">
        <p className="text-navy-500 text-xs leading-relaxed">{isZh ? data.textZh : data.textEn}</p>
      </div>
    </div>
  )
}
