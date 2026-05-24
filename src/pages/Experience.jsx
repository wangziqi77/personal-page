import { useState } from 'react'
import { useLang } from '../hooks/useLang'
import { experiences } from '../data/experience'

export default function Experience() {
  const { t, lang } = useLang()
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <p className="text-navy-400 text-sm font-medium uppercase tracking-widest mb-3">Timeline</p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy-700 mb-4">{t.experience.title}</h1>
        <p className="text-navy-400 text-lg">{t.experience.subtitle}</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-2 bottom-2 w-px bg-cream-300 hidden md:block" />

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <div key={exp.id} className="relative">
              {/* Dot */}
              <div
                className="absolute left-4 top-6 w-4 h-4 rounded-full border-2 border-cream-100 hidden md:block z-10"
                style={{ backgroundColor: exp.color }}
              />

              <div
                className="md:ml-16 rounded-2xl border border-cream-300 bg-cream-50
                           hover:border-navy-400/30 hover:shadow-sm transition-all duration-300"
              >
                {/* Card header */}
                <button
                  className="w-full text-left p-6"
                  onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: exp.color + '40', color: '#2c4660' }}
                        >
                          {lang === 'zh' ? exp.typeZh : exp.typeEn}
                        </span>
                        <span className="text-navy-400/60 text-xs">{exp.period}</span>
                      </div>
                      <h3 className="text-navy-700 font-semibold text-lg">
                        {lang === 'zh' ? exp.orgZh : exp.orgEn}
                      </h3>
                      <p className="text-navy-500 text-sm mt-0.5">
                        {lang === 'zh' ? exp.roleZh : exp.roleEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-navy-400 text-xs">
                        📍 {lang === 'zh' ? exp.locationZh : exp.locationEn}
                      </span>
                      <span
                        className={`text-navy-400 transition-transform duration-300 ${expanded === exp.id ? 'rotate-180' : ''}`}
                      >
                        ↓
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(lang === 'zh' ? exp.tagsZh : exp.tagsEn).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-navy-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>

                {/* Expanded bullets */}
                {expanded === exp.id && (
                  <div className="px-6 pb-6 border-t border-cream-300 pt-4">
                    <ul className="space-y-3">
                      {(lang === 'zh' ? exp.bulletsZh : exp.bulletsEn).map((b, j) => (
                        <li key={j} className="flex gap-3 text-navy-500 text-sm leading-relaxed">
                          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-navy-400 mt-2" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
