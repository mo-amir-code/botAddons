import { LANGUAGE_SELECTED_MSG, TOAST_TIME_IN_MS } from "@/config/constants"
import { useLanguage } from "@/contexts/languageContext"
import { useToast } from "@/contexts/toastContext"
import { languages } from "@/utils/data"
import type { LanguageCode } from "@/utils/data/language"
import { useEffect } from "react"

const AddPrompt = () => {
  const { setLanguage, language } = useLanguage()
  const { addToast } = useToast()

  const handleSelectLanguage = ({
    langKey,
    langName
  }: {
    langKey: LanguageCode
    langName: string
  }) => {
    setLanguage(langKey)
    addToast(
      LANGUAGE_SELECTED_MSG.replace("{name", langName),
      "success",
      TOAST_TIME_IN_MS
    )
  }

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
            onClick={() =>
              handleSelectLanguage({
                langKey: lang.key as LanguageCode,
                langName: lang.name
              })
            }
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
