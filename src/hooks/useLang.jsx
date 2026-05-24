import { createContext, useContext, useState } from 'react'
import zh from '../locales/zh.json'
import en from '../locales/en.json'

const translations = { zh, en }

export const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'zh')

  function toggle() {
    const next = lang === 'zh' ? 'en' : 'zh'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  const t = translations[lang]

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
