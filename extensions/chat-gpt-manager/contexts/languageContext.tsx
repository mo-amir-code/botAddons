import {
  translations,
  type LanguageCode,
  type TranslationKeys
} from "@/utils/data/language"
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"

// Types for context
interface LanguageContextType {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: TranslationKeys) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key
})

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children
}) => {
  const getBrowserLanguage = (): LanguageCode => {
    const browserLang = navigator.language.split("-")[0] as LanguageCode
    return Object.keys(translations).includes(browserLang) ? browserLang : "en"
  }

  const [language, setLanguage] = useState<LanguageCode>(
    (localStorage.getItem("language") as LanguageCode) || getBrowserLanguage()
  )

  // Update when language changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType =>
  useContext(LanguageContext)
