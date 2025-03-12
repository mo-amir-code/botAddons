import { useLanguage } from "@/contexts/languageContext"
import { languages } from "@/utils/data"
import type { LanguageCode } from "@/utils/data/language"
import { useEffect } from "react"

const AddPrompt = () => {
  const { setLanguage, language } = useLanguage()

  useEffect(() => {
    if (language === "ae") {
      document.body.style.direction = "rtl"
      document.body.style.textAlign = "right"
    } else {
      document.body.style.direction = "ltr"
      document.body.style.textAlign = "left"
    }
  }, [language])

  return (
    <div className="w-[500px] relative overflow-height scrollbar-hide">
      <ul>
        {languages.map((lang) => (
          <li
            key={lang.key}
            onClick={() => setLanguage(lang.key as LanguageCode)}
            className={`flex items-center gap-4 text-xl font-semibold ${language == lang.key ? "bg-secondary-bg" : "hover:bg-secondary-bg"} px-3 py-2 rounded-xl cursor-pointer`}>
            <div className="w-6 h-auto">
              <img
                src={lang.icon}
                alt={lang.name}
                className="object-cover h-full w-full"
              />
            </div>
            <span>{lang.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AddPrompt
