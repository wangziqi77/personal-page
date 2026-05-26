import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang.jsx'
import { projects } from '../data/projects'

export default function ProjectDetail() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const project = projects.find(p => p.id === id)
  const isZh = lang === 'zh'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <p className="text-navy-400 text-lg mb-4">Project not found.</p>
        <Link to="/" className="text-navy-500 hover:underline">← Back</Link>
      </div>
    )
  }

  const p = project
  const base = import.meta.env.BASE_URL

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back */}
      <Link to="/" state={{ scrollTo: 'projects' }}
        className="inline-flex items-center gap-2 text-navy-400 hover:text-navy-600 text-sm mb-10 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        {t.projects.back}
      </Link>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className={`rounded-2xl bg-gradient-to-br ${p.bgGradient} border border-cream-300 mb-10 overflow-hidden`}>
        <div className="flex items-stretch">
          {/* Left: text content */}
          <div className="flex-1 p-8 md:p-10">
            <span className="text-xs font-mono text-navy-400/70 block mb-3">{p.year}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-700 mb-3 leading-snug">
              {isZh ? p.titleZh : p.titleEn}
            </h1>
            <p className="text-navy-500 text-base mb-6 leading-relaxed">
              {isZh ? p.taglineZh : p.taglineEn}
            </p>
            <div className="flex flex-wrap gap-2">
              {(isZh ? p.tagsZh : p.tagsEn).map(tag => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: p.color + '55', color: '#2c4660' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: icon image (or emoji fallback) */}
          {p.iconImage ? (
            <div className="hidden sm:flex items-center justify-center flex-shrink-0 pr-8">
              <img
                src={`${base}${p.iconImage}`}
                alt=""
                className="rounded-xl object-cover shadow-sm"
                style={{ height: 'calc(100% - 48px)', maxHeight: 200, maxWidth: 200, width: 'auto' }}
              />
            </div>
          ) : (
            <div className="hidden sm:flex items-center justify-center w-32 flex-shrink-0">
              <span className="text-6xl opacity-60">{p.emoji}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      <Section color={p.color} title={isZh ? '项目概述' : 'Overview'}>
        <p className="text-navy-500 leading-relaxed mb-4">{isZh ? p.overviewZh : p.overviewEn}</p>
        {p.prdPath && (
          <a href={`${base}${p.prdPath}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{ backgroundColor: p.color + '50', color: '#2c4660' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = p.color + '80'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = p.color + '50'}
          >
            📄 {isZh ? '查看完整 PRD ↗' : 'View Full PRD ↗'}
          </a>
        )}
      </Section>

      {/* ── Slides PDF ──────────────────────────────────────────────────── */}
      {p.slidesPath && (
        <Section color={p.color} title={isZh ? '项目 Slides' : 'Project Slides'}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-navy-400 text-xs">
              {isZh ? '可滚动查看完整内容' : 'Scroll to view full presentation'}
            </span>
            <a href={`${base}${p.slidesPath}`} target="_blank" rel="noopener noreferrer"
              className="text-navy-400 hover:text-navy-600 text-xs transition-colors">
              {isZh ? '新窗口打开' : 'Open in new tab'} ↗
            </a>
          </div>
          <div className="rounded-xl border border-cream-300 overflow-hidden">
            <object
              data={`${base}${p.slidesPath}`}
              type="application/pdf"
              className="w-full"
              style={{ height: '70vh', minHeight: 480 }}
            >
              <embed
                src={`${base}${p.slidesPath}`}
                type="application/pdf"
                className="w-full"
                style={{ height: '70vh', minHeight: 480 }}
              />
            </object>
          </div>
          {p.promoVideo && (
            <a href={p.promoVideo} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: p.color + '50', color: '#2c4660' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = p.color + '80'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = p.color + '50'}
            >
              ▶ {isZh ? '观看推广视频' : 'View Promotion Video'}
            </a>
          )}
        </Section>
      )}

      {/* ── Role ────────────────────────────────────────────────────────── */}
      {p.roleZh && (
        <Section color={p.color} title={t.projects.myRole}>
          <div className="bg-cream-50 border border-cream-300 rounded-xl p-5">
            <p className="text-navy-500 leading-relaxed">{isZh ? p.roleZh : p.roleEn}</p>
          </div>
        </Section>
      )}

      {/* ── Tech Stack ──────────────────────────────────────────────────── */}
      <Section color={p.color} title={t.projects.techStack}>
        <div className="flex flex-wrap gap-2">
          {(isZh ? p.stackZh : p.stackEn).map(s => (
            <span key={s} className="px-3 py-1.5 rounded-lg bg-cream-200 text-navy-600 text-sm font-medium">{s}</span>
          ))}
        </div>
      </Section>

      {/* ── Outcomes ────────────────────────────────────────────────────── */}
      <Section color={p.color} title={t.projects.outcome}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(isZh ? p.outcomesZh : p.outcomesEn).map((o, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl border border-cream-300 bg-cream-50">
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold mt-0.5"
                style={{ backgroundColor: p.color }}>✓</span>
              <p className="text-navy-500 text-sm leading-relaxed">{o}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Architecture (moved to bottom) ──────────────────────────────── */}
      <ArchitectureSection p={p} isZh={isZh} base={base} />

      {/* ── Image gallery ───────────────────────────────────────────────── */}
      {p.images?.length > 0 && (
        <Section color={p.color} title={isZh ? '项目展示' : 'Showcase'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {p.images.map((img, i) => (
              <img key={i} src={`${base}images/${img}`} alt=""
                className="rounded-xl border border-cream-300 w-full object-cover" />
            ))}
          </div>
        </Section>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="pt-8 border-t border-cream-300">
        <Link to="/" state={{ scrollTo: 'projects' }}
          className="inline-flex items-center gap-2 text-navy-400 hover:text-navy-600 text-sm transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          {t.projects.back}
        </Link>
      </div>
    </div>
  )
}

// ── Architecture section router ───────────────────────────────────────────────
function ArchitectureSection({ p, isZh, base }) {
  if (p.architecture.some(s => s.step === 'Hub')) {
    return <HubArchitectureSection p={p} isZh={isZh} />
  }
  return <LinearArchitectureSection p={p} isZh={isZh} base={base} />
}

// ── Hub-spoke layout (multi-agent projects) ───────────────────────────────────
function HubArchitectureSection({ p, isZh }) {
  const hub    = p.architecture.find(s => s.step === 'Hub')
  const safety = p.architecture.find(s => s.priority)
  const agents = p.architecture.filter(s => s.step !== 'Hub' && !s.priority)
  const c = p.color

  const lblCtx   = isZh ? '上下文构成'   : 'Context'
  const lblTools = isZh ? '工具调用'     : 'Tools'
  const lblMech  = isZh ? '核心处理机制' : 'Mechanism'

  function subsWide(step) {
    return (
      <div className="grid grid-cols-3 gap-5 mt-4 pt-4 border-t border-cream-300">
        {[
          [lblCtx,   isZh ? step.contextZh  : step.contextEn],
          [lblTools, isZh ? step.toolsZh    : step.toolsEn],
          [lblMech,  isZh ? step.mechanismZh : step.mechanismEn],
        ].map(([label, text]) => (
          <div key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: c }}>{label}</p>
            <p className="text-navy-500 text-xs leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    )
  }

  function subsNarrow(step) {
    return (
      <div className="mt-2">
        {[
          [lblCtx,   isZh ? step.contextZh  : step.contextEn],
          [lblTools, isZh ? step.toolsZh    : step.toolsEn],
          [lblMech,  isZh ? step.mechanismZh : step.mechanismEn],
        ].map(([label, text], i) => (
          <div key={label} className={`py-2 ${i > 0 ? 'border-t border-cream-200' : ''}`}>
            <p className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: c }}>{label}</p>
            <p className="text-navy-500 text-[11px] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Section color={c} title={isZh ? '系统 / 方案架构' : 'Architecture'}>
      {/* Hub */}
      <div className="p-5 rounded-xl border border-cream-300 bg-cream-50" style={{ borderLeftColor: c, borderLeftWidth: 3 }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-md text-xs font-bold text-white" style={{ backgroundColor: c }}>
            {hub.step}
          </span>
          <h4 className="text-navy-700 font-semibold text-sm">{isZh ? hub.titleZh : hub.titleEn}</h4>
        </div>
        <p className="text-navy-400 text-xs leading-relaxed">{isZh ? hub.descZh : hub.descEn}</p>
        {subsWide(hub)}
      </div>

      <div className="flex justify-center my-3"><div className="w-px h-5 bg-cream-300" /></div>

      {/* Safety Agent */}
      <div className="p-5 rounded-xl bg-cream-50" style={{ border: '1px solid #f0cac8', borderLeft: '3px solid #d98080' }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="flex-shrink-0 px-2.5 py-0.5 rounded-md text-xs font-bold text-white" style={{ backgroundColor: '#d98080' }}>
            {safety.step}
          </span>
          <h4 className="text-navy-700 font-semibold text-sm">{isZh ? safety.titleZh : safety.titleEn}</h4>
        </div>
        <p className="text-navy-400 text-xs leading-relaxed">{isZh ? safety.descZh : safety.descEn}</p>
        {subsWide(safety)}
      </div>

      <div className="flex justify-center my-3"><div className="w-px h-5 bg-cream-300" /></div>

      {/* 4 Agents */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {agents.map(step => (
          <div key={step.step} className="p-4 rounded-xl border border-cream-300 bg-cream-50">
            <div className="flex items-start gap-2 mb-1">
              <span className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold text-white mt-0.5"
                style={{ backgroundColor: c }}>
                {step.step}
              </span>
              <h4 className="text-navy-700 font-semibold text-xs leading-tight">{isZh ? step.titleZh : step.titleEn}</h4>
            </div>
            {subsNarrow(step)}
          </div>
        ))}
      </div>
    </Section>
  )
}

// ── Linear architecture section (step-by-step projects) ──────────────────────
function LinearArchitectureSection({ p, isZh, base }) {
  const stepsRef = useRef(null)
  const [stepsHeight, setStepsHeight] = useState(null)

  useEffect(() => {
    if (!stepsRef.current) return
    const ro = new ResizeObserver(entries => {
      setStepsHeight(entries[0].contentRect.height)
    })
    ro.observe(stepsRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <Section color={p.color} title={isZh ? '系统 / 方案架构' : 'Architecture'}>
      <div className="flex gap-5 mb-6 items-start">
        {/* Steps list */}
        <div ref={stepsRef} className="space-y-3 flex-shrink-0"
          style={{ width: p.reportImage ? '55%' : '100%', minWidth: 260 }}>
          {p.architecture.map(step => (
            <div key={step.step} className="flex gap-3 p-4 rounded-xl border border-cream-300 bg-cream-50">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: p.color }}>
                {step.step}
              </div>
              <div>
                <h4 className="text-navy-700 font-semibold text-sm mb-0.5">
                  {isZh ? step.titleZh : step.titleEn}
                </h4>
                <p className="text-navy-400 text-xs leading-relaxed">
                  {isZh ? step.descZh : step.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Report screenshot — height synced to steps list, scrollable */}
        {p.reportImage && (
          <div className="flex-1 rounded-xl border border-cream-300 overflow-y-auto"
            style={{ height: stepsHeight ?? 400 }}>
            <img
              src={`${base}${p.reportImage}`}
              alt="Project Report"
              className="w-full h-auto block"
            />
          </div>
        )}
      </div>

      {/* Diagram — inline viewer (supports scroll-wheel zoom + drag) */}
      {p.diagramPath && (
        <DiagramViewer src={`${base}${p.diagramPath}`} isZh={isZh} />
      )}
    </Section>
  )
}

// ── Diagram viewer (SVG/PNG/PDF image embed) ─────────────────────────────────
function DiagramViewer({ src, isZh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-navy-400 text-xs">
          {isZh ? '系统架构图' : 'Architecture Diagram'}
        </span>
        <a href={src} target="_blank" rel="noopener noreferrer"
          className="text-navy-400 hover:text-navy-600 text-xs transition-colors">
          {isZh ? '新窗口打开' : 'Open in new tab'} ↗
        </a>
      </div>
      <div className="rounded-xl border border-cream-300 overflow-hidden p-4">
        <img src={src} alt="Architecture Diagram" className="w-full h-auto block" />
      </div>
    </div>
  )
}

// ── Shared section wrapper ───────────────────────────────────────────────────
function Section({ color, title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-navy-700 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full block" style={{ backgroundColor: color }} />
        {title}
      </h2>
      {children}
    </section>
  )
}
