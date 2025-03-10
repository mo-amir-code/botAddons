import { PROMPT_INPUT_ELEMENT_INJECT_ID } from "@/config/constants"
import { colors } from "@/config/theme"
import type { PromptFileType, PromptTriggerType } from "@/utils/types/components/modal"
import { useEffect, useState, useRef } from "react"

const PromptsList = () => {
  const [element, setElement] = useState<HTMLParagraphElement | null>(null);
  const [promptTrigger, setPromptTrigger] = useState<PromptTriggerType>({
    isPromptOpen: false,
    promptQuery: "",
  })
  const [prompts, setPrompts] = useState<PromptFileType[]>([])
  const [results, setResults] = useState<PromptFileType[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<PromptFileType | null>(null)
  const listRef = useRef<HTMLUListElement>(null) // Ref for the list to handle focus

  // Handle selection by ID
  const handleSelect = (id: string) => {
    const prompt = prompts.find((prompt) => prompt.id === id)
    if(element) {
      element.innerHTML = `${prompt?.content}`
      element.focus()
    }
  }

  // Update selected prompt when results change
  useEffect(() => {
    setSelectedPrompt(results[0])
  }, [results])

  // Filter prompts based on query
  useEffect(() => {
    if (promptTrigger?.isPromptOpen) {
      const filteredResults = prompts.filter((prompt) =>
        prompt.title.toLowerCase().includes(promptTrigger.promptQuery.toLowerCase())
      )
      setResults(filteredResults)
    }
  }, [promptTrigger])

  // Fetch initial data from chrome storage
  useEffect(() => {
    const execute = async () => {
      const promptsTrigger = ((await chrome.storage.local.get("promptsList")) as any)?.["promptsList"]
      if (promptsTrigger) setPromptTrigger(promptsTrigger)

      const promptsData = ((await chrome.storage.local.get("prompts")) as any)?.["prompts"]
      if (promptsData) setPrompts(promptsData)
    }
    execute()
  }, [])

  // Observe changes to the input element
  useEffect(() => {
    const element = document.querySelector(PROMPT_INPUT_ELEMENT_INJECT_ID) as HTMLParagraphElement
    if (element) {
      setElement(element)

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList" || mutation.type === "characterData") {
            let promptTriggerData: PromptTriggerType = {
              isPromptOpen: false,
              promptQuery: "",
            }
            if (element.textContent?.startsWith("//")) {
              promptTriggerData.isPromptOpen = true
              promptTriggerData.promptQuery = element.textContent.replace("//", "")
            }
            setPromptTrigger(promptTriggerData)
          }
        })
      })
      observer.observe(element, { childList: true, subtree: true, characterData: true })
      return () => observer.disconnect() // Cleanup observer
    } else {
      console.warn("Placeholder element not found!")
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!promptTrigger?.isPromptOpen || results.length === 0) return

      const currentIndex = selectedPrompt
        ? results.findIndex((prompt) => prompt.id === selectedPrompt.id)
        : -1

      
      if(e.key == "Tab") {
        if(selectedPrompt) {
          element.innerHTML = `${selectedPrompt.content}`
        }
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % results.length
        setSelectedPrompt(results[nextIndex])
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prevIndex = currentIndex <= 0 ? results.length - 1 : currentIndex - 1
        setSelectedPrompt(results[prevIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [results, selectedPrompt, promptTrigger?.isPromptOpen, element])

  if (!promptTrigger?.isPromptOpen) return null

  return (
    <div
      style={{ backgroundColor: colors["primary-bg"] }}
      className="scrollbar-hide w-full h-[40vh] z-50 float-end overflow-auto rounded-3xl"
    >
      <ul ref={listRef} className="w-full">
        {results.map((prompt) => (
          <li
            key={prompt.id}
            onClick={() => handleSelect(prompt.id)}
            style={{
              backgroundColor:
                prompt.id === selectedPrompt?.id ? colors["secondary-bg"] : "",
            }}
            className={`p-4 transition-colors cursor-pointer duration-200 ${
              prompt.id === selectedPrompt?.id
                ? "bg-opacity-100"
                : "hover:bg-secondary-bg"
            }`}
          >
            <h4 className="text-lg font-semibold">{prompt.title}</h4>
            <p className="text-sm text-gray-400">{prompt.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PromptsList