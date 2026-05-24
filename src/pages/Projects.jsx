import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { projects } from '../data/projects'

export default function Projects() {
  const { t, lang } = useLang()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <p className="text-navy-400 text-sm font-medium uppercase tracking-widest mb-3">Work</p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy-700 mb-4">{t.projects.title}</h1>
        <p className="text-navy-400 text-lg">{t.projects.subtitle}</p>
      </div>

      {/* Project cards */}
      <div className="space-y-6">
        {projects.map((p, i) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="group block rounded-2xl border border-cream-300 bg-cream-50
                       hover:border-navy-400/30 hover:shadow-md hover:-translate-y-0.5
                       transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Color accent strip */}
              <div
                className="md:w-2 w-full h-2 md:h-auto flex-shrink-0"
                style={{ backgroundColor: p.color }}
              />

              <div className="p-6 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-navy-400/60 text-sm">{lang === 'zh' ? p.yearZh : p.yearEn}</span>
                    </div>
                    <h2 className="text-navy-700 font-semibold text-xl mb-2 group-hover:text-navy-500 transition-colors">
                      {lang === 'zh' ? p.titleZh : p.titleEn}
                    </h2>
                    <p className="text-navy-400 text-sm mb-4">
                      {lang === 'zh' ? p.taglineZh : p.taglineEn}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(lang === 'zh' ? p.tagsZh : p.tagsEn).map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: p.color + '35', color: '#3a5a7a' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center self-center text-navy-400/50 group-hover:text-navy-500
                                  group-hover:translate-x-1 transition-all duration-300 text-xl">
                    →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
