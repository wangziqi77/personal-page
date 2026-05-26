import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../hooks/useLang.jsx'
import { experiences } from '../data/experience'
import { projects } from '../data/projects'

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="mb-12">
      <FadeIn>
        <span className="text-navy-400/50 text-sm font-mono tracking-widest">{number}</span>
      </FadeIn>
      <FadeIn delay={72}>
        <h2 className="text-3xl md:text-4xl font-bold text-navy-700 mt-1 mb-3">{title}</h2>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={144}>
          <p className="text-navy-400 text-base">{subtitle}</p>
        </FadeIn>
      )}
    </div>
  )
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = 1; el.style.transform = 'translateY(0)'; obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}
      style={{ opacity: 0, transform: 'translateY(40px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection({ t, lang }) {
  const base = import.meta.env.BASE_URL
  return (
    <section id="about" className="min-h-[88vh] flex items-center py-20">
      <div className="w-full flex flex-col md:flex-row items-center gap-12 md:gap-16">

        {/* Left: text */}
        <div className="flex-1 min-w-0">
          <FadeIn>
            <p className="text-navy-400 font-medium mb-4 tracking-wide">
              {lang === 'zh' ? '你好，我是' : "Hi, I'm"}
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-6xl md:text-8xl font-bold text-navy-700 leading-none mb-6 tracking-tight">
              Wang
              <span className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-navy-500 ml-2 mb-2 align-bottom" />
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-navy-500 text-xl md:text-2xl font-light max-w-xl mb-8 leading-relaxed">
              {lang === 'zh'
                ? '产品经理 · AI 实践者 · 让创意真正落地'
                : 'Product Manager · AI Practitioner · Turning Ideas into Products'}
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="text-navy-400 text-base max-w-2xl leading-relaxed mb-10">
              {lang === 'zh'
                ? '习惯用产品思维发现问题、拆解路径，再借助 AI 工具把想法做成真实可用的产品——从 0 到 1 的过程本身，就是我最享受的事。随时欢迎实习机会，也期待各种有趣的合作。'
                : 'I think in product frameworks and build with AI. From spotting the right problem to shipping something real, I use AI as a co-builder to collapse the distance between idea and product — fast. Always open to internships and cool collabs.'}
            </p>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl bg-navy-700 text-cream-50 text-sm font-semibold
                           hover:bg-navy-600 transition-colors duration-200 tracking-wide"
              >
                {lang === 'zh' ? '查看项目 →' : 'VIEW PROJECTS →'}
              </button>
              <a
                href={`${base}resume.pdf`}
                download
                className="px-6 py-3 rounded-xl border border-navy-400/50 text-navy-600 text-sm font-semibold
                           hover:border-navy-600 hover:bg-cream-100 transition-colors duration-200 tracking-wide"
              >
                {lang === 'zh' ? '下载简历 ↓' : 'DOWNLOAD RESUME ↓'}
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-navy-400/40" />
              <span className="text-navy-400/70 text-sm">
                {lang === 'zh' ? '向下滚动探索' : 'Scroll to explore'}
              </span>
              <span className="text-navy-400/50 animate-bounce">↓</span>
            </div>
          </FadeIn>
        </div>

        {/* Right: profile photo */}
        <FadeIn delay={200} className="hidden md:block flex-shrink-0">
          <div className="relative" style={{ width: 338, height: 442 }}>
            <img
              src={`${base}images/77.png`}
              alt=""
              className="absolute pointer-events-none"
              style={{ width: 220, top: -70, right: -40, zIndex: 0 }}
            />
            <img
              src={`${base}images/ProfilePhoto.jpg`}
              alt=""
              className="absolute inset-0 rounded-2xl object-cover object-top shadow-md"
              style={{ width: 338, height: 442, zIndex: 1 }}
            />
          </div>
        </FadeIn>

      </div>
    </section>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────
function ExperienceSection({ t, lang }) {
  const items = experiences.filter(e => e.typeEn !== 'Education')

  return (
    <section id="experience" className="py-24">
      <SectionHeader
        number="01"
        title={t.experience.title}
        subtitle={lang === 'zh' ? '工作与实习经历' : 'Work & Internship'}
      />
      <div className="space-y-5">
        {items.map((exp, i) => (
          <FadeIn key={exp.id} delay={216 + i * 120}>
            <ExperienceCard exp={exp} lang={lang} />
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

function ExperienceCard({ exp, lang }) {
  const isZh = lang === 'zh'
  const bullets = isZh ? exp.bulletsZh : exp.bulletsEn
  return (
    <div className="group rounded-2xl border border-cream-300 bg-cream-50 hover:border-navy-400/40
                    hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex">
        <div className="w-1 flex-shrink-0 transition-colors duration-300" style={{ backgroundColor: exp.color }} />
        <div className="p-6 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: exp.color + '35', color: '#3a5a7a' }}>
                  {isZh ? exp.typeZh : exp.typeEn}
                </span>
                <span className="text-navy-400/60 text-xs font-mono">{exp.period}</span>
              </div>
              <h3 className="text-navy-700 font-bold text-lg">{isZh ? exp.orgZh : exp.orgEn}</h3>
              <p className="text-navy-500 text-sm mt-0.5">{isZh ? exp.roleZh : exp.roleEn}</p>
            </div>
            <span className="text-navy-400 text-xs mt-1">📍 {isZh ? exp.locationZh : exp.locationEn}</span>
          </div>
          {bullets?.length > 0 && (
            <ul className="space-y-2 mb-4">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-navy-500 leading-relaxed">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                    style={{ backgroundColor: exp.color }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-1.5">
            {(isZh ? exp.tagsZh : exp.tagsEn).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-navy-500">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Education ────────────────────────────────────────────────────────────────
function EducationSection({ t, lang }) {
  const items = experiences.filter(e => e.typeEn === 'Education')
  return (
    <section id="education" className="py-24">
      <SectionHeader
        number="02"
        title={lang === 'zh' ? '教育背景' : 'Education'}
        subtitle={lang === 'zh' ? '学术经历与成就' : 'Academic background & achievements'}
      />
      <div className="space-y-5">
        {items.map((exp, i) => (
          <FadeIn key={exp.id} delay={216 + i * 120}>
            <ExperienceCard exp={exp} lang={lang} />
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection({ t, lang }) {
  const isZh = lang === 'zh'
  return (
    <section id="projects" className="py-24">
      <SectionHeader number="03" title={t.projects.title} subtitle={isZh ? '将创意转化为真实产品' : 'Turning ideas into real products'} />
      <div className="space-y-5">
        {projects.map((p, i) => (
          <FadeIn key={p.id} delay={216 + i * 120}>
            <ProjectCard p={p} isZh={isZh} t={t} />
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ p, isZh, t }) {
  const base = import.meta.env.BASE_URL
  const btnCls = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-navy-400/40 text-navy-600 hover:border-navy-500 hover:bg-white/40 transition-colors"

  return (
    <div className={`group rounded-2xl bg-gradient-to-br ${p.bgGradient} border border-cream-300
                     hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}>
      <div className="flex items-stretch">

        {/* Left: text content */}
        <div className="flex-1 p-6 md:p-8 min-w-0">
          <span className="text-xs font-mono text-navy-400/70 block mb-2">{p.year}</span>
          <h3 className="text-lg md:text-xl font-bold text-navy-700 mb-2 leading-snug">
            {isZh ? p.titleZh : p.titleEn}
          </h3>
          <p className="text-navy-500 text-sm mb-4 leading-relaxed">
            {isZh ? p.taglineZh : p.taglineEn}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(isZh ? p.tagsZh : p.tagsEn).map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: p.color + '55', color: '#2c4660' }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/projects/${p.id}`} className={btnCls}>
              {isZh ? '查看项目 →' : 'View Project →'}
            </Link>
            {p.prdPath && (
              <a href={`${base}${p.prdPath}`} target="_blank" rel="noopener noreferrer" className={btnCls}>
                {isZh ? '查看 PRD ↗' : 'View PRD ↗'}
              </a>
            )}
            {p.promoVideo && (
              <a href={p.promoVideo} target="_blank" rel="noopener noreferrer" className={btnCls}>
                ▶ {isZh ? '观看推广视频' : 'View Promotion Video'}
              </a>
            )}
          </div>
        </div>

        {/* Right: icon */}
        <Link to={`/projects/${p.id}`}
          className="hidden sm:flex flex-col items-center justify-center flex-shrink-0 pr-8">
          {p.iconImage ? (
            <img src={`${base}${p.iconImage}`} alt=""
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              style={{ height: 100, width: 100 }} />
          ) : (
            <span className="text-5xl opacity-60 group-hover:scale-105 transition-transform duration-500">
              {p.emoji}
            </span>
          )}
        </Link>

      </div>
    </div>
  )
}

// ─── Explore Me ───────────────────────────────────────────────────────────────
function ExploreMeSection({ t, lang }) {
  const isZh = lang === 'zh'
  const strengths = t.explore.strengths.items
  const strengthIcons = ['🔗', '🎯', '⚡', '✨']

  return (
    <section id="explore" className="py-24 pb-32">
      <SectionHeader
        number="04"
        title={t.explore.title}
        subtitle={isZh ? '多维度的我' : 'A multidimensional portrait'}
      />

      {/* Strengths grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {strengths.map((s, i) => (
          <FadeIn key={i} delay={216 + i * 120}>
            <div className="p-5 rounded-2xl border border-cream-300 bg-cream-50
                            hover:border-navy-400/30 hover:shadow-sm transition-all duration-300">
              <span className="text-xl mb-3 block">{strengthIcons[i]}</span>
              <h4 className="text-navy-700 font-semibold mb-1.5 text-sm">{s.title}</h4>
              <p className="text-navy-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Sub-page links */}
      <FadeIn delay={200}>
        <p className="text-navy-400/70 text-sm mb-5">
          {isZh ? '深入了解' : 'Dive deeper'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/explore/hobbies"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-cream-300 bg-cream-50
                       hover:border-navy-400/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="text-3xl">🎸</span>
            <div className="flex-1">
              <h4 className="text-navy-700 font-semibold mb-0.5">
                {isZh ? '兴趣爱好' : 'Hobbies'}
              </h4>
              <p className="text-navy-400 text-xs">
                {isZh ? '篮球、滑雪、电吉他、摄影...' : 'Basketball, skiing, guitar, photography...'}
              </p>
            </div>
            <span className="text-navy-400/40 group-hover:text-navy-600 group-hover:translate-x-1 transition-all duration-200">→</span>
          </Link>

          <Link to="/explore/world"
            className="group flex items-center gap-4 p-5 rounded-2xl border border-cream-300 bg-cream-50
                       hover:border-navy-400/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="text-3xl">🌍</span>
            <div className="flex-1">
              <h4 className="text-navy-700 font-semibold mb-0.5">
                {isZh ? '环游世界足迹' : 'World Footprint'}
              </h4>
              <p className="text-navy-400 text-xs">
                {isZh ? '17 个国家 / 地区的故事' : '17 countries & territories'}
              </p>
            </div>
            <span className="text-navy-400/40 group-hover:text-navy-600 group-hover:translate-x-1 transition-all duration-200">→</span>
          </Link>
        </div>
      </FadeIn>
    </section>
  )
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const { t, lang } = useLang()
  const location = useLocation()

  // Handle scroll-to from nav when navigating back from sub-pages
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
      // Clear state from history so refresh doesn't re-trigger scroll
      window.history.replaceState(null, '')
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [location.state])

  return (
    <div className="max-w-5xl mx-auto px-6">
      <AboutSection t={t} lang={lang} />
      <div className="h-px bg-cream-300" />
      <ExperienceSection t={t} lang={lang} />
      <div className="h-px bg-cream-300" />
      <EducationSection t={t} lang={lang} />
      <div className="h-px bg-cream-300" />
      <ProjectsSection t={t} lang={lang} />
      <div className="h-px bg-cream-300" />
      <ExploreMeSection t={t} lang={lang} />
    </div>
  )
}
