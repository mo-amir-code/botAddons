import { PROMPT_INPUT_ELEMENT_INJECT_ID } from "@/config/constants"
import { colors } from "@/config/theme"
import type { AuthSessionUserType } from "@/utils/services/auth"
import type {
  PromptFileType,
  PromptTriggerType
} from "@/utils/types/components/modal"
import { useEffect, useRef, useState } from "react"

const PromptsList = () => {
  const [element, setElement] = useState<HTMLParagraphElement | null>(null)
  const [promptTrigger, setPromptTrigger] = useState<PromptTriggerType>({
    isPromptOpen: false,
    promptQuery: ""
  })
  const [prompts, setPrompts] = useState<PromptFileType[]>([])
  const [results, setResults] = useState<PromptFileType[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<PromptFileType | null>(
    null
  )
  const selectedItemRef = useRef<HTMLLIElement>()
  const [userInfo, setUserInfo] = useState<AuthSessionUserType | null>(null)

  // Handle selection by ID
  const handleSelect = (id: string) => {
    const prompt = prompts.find((prompt) => prompt.id === id)
    if (element) {
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
        prompt.title
          .toLowerCase()
          .includes(promptTrigger.promptQuery.toLowerCase())
      )
      setResults(filteredResults)
    } else {
      setResults([])
    }
  }, [promptTrigger])

  const fetchData = async ({ userId }: { userId: string }) => {
    let finalKey = "prompts" + "-" + userId
    const promptsData = ((await chrome.storage.local.get(finalKey)) as any)?.[
      finalKey
    ]

    if (promptsData) setPrompts(promptsData)
  }

  // Fetch initial data from chrome storage
  useEffect(() => {

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local" && changes["prompts"+"-"+userInfo.id]) {
        fetchData({userId: userInfo.id})
      }
    }

    if(userInfo){
      fetchData({userId: userInfo.id})
      chrome.storage.onChanged.addListener(handleStorageChange)
    }

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [userInfo])

  const handleSetUser = async () => {
    const user = ((await chrome.storage.local.get("user")) as any)?.["user"]
    setUserInfo(user)
  }

  useEffect(() => {
    handleSetUser()

    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local" && changes["user"]) {
        handleSetUser()
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  // Observe changes to the input element
  useEffect(() => {
    const paragraphElement = document.querySelector(
      PROMPT_INPUT_ELEMENT_INJECT_ID
    ) as HTMLParagraphElement

    if (paragraphElement) {
      setElement(paragraphElement)

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "childList" ||
            mutation.type === "characterData"
          ) {
            let promptTriggerData: PromptTriggerType = {
              isPromptOpen: false,
              promptQuery: ""
            }
            if (paragraphElement.textContent?.startsWith("//")) {
              promptTriggerData.isPromptOpen = true
              promptTriggerData.promptQuery =
                paragraphElement.textContent.replace("//", "")
            }
            setPromptTrigger(promptTriggerData)
          }
        })
      })
      observer.observe(paragraphElement, {
        childList: true,
        subtree: true,
        characterData: true
      })
      return () => observer.disconnect() // Cleanup observer
    } else {
      console.warn("Placeholder element not found!")
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0) return

      const currentIndex = selectedPrompt
        ? results.findIndex((prompt) => prompt.id === selectedPrompt.id)
        : -1

      if (e.key === "Tab") {
        if (selectedPrompt) {
          element.innerHTML = `${selectedPrompt.content}`
          element.focus()
          const range = document.createRange()
          const selection = window.getSelection()

          range.selectNodeContents(element)
          range.collapse(false)

          selection.removeAllRanges()
          selection.addRange(range)
          e.preventDefault()
        }
      }

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % results.length
        setSelectedPrompt(results[nextIndex])
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prevIndex =
          currentIndex <= 0 ? results.length - 1 : currentIndex - 1
        setSelectedPrompt(results[prevIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown) // Use window instead of document

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [results, selectedPrompt, promptTrigger?.isPromptOpen, element])

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.focus()
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      })
    }
  }, [selectedPrompt])

  if (!promptTrigger?.isPromptOpen) return null

  return (
    <div
      style={{ backgroundColor: colors["primary-bg"] }}
      className="scrollbar-hide w-full max-h-[300px] overflow-y-scroll z-50 float-end rounded-3xl">
      <ul className="w-full h-full">
        {results.map((prompt) => (
          <li
            key={prompt.id}
            ref={prompt.id === selectedPrompt?.id ? selectedItemRef : null}
            onClick={() => handleSelect(prompt.id)}
            style={{
              backgroundColor:
                prompt.id === selectedPrompt?.id ? colors["secondary-bg"] : ""
            }}
            className={`p-4 transition-colors rounded-xl cursor-pointer duration-200 ${
              prompt.id === selectedPrompt?.id
                ? "bg-opacity-100"
                : "hover:bg-secondary-bg"
            }`}>
            <h4 className="text-lg font-semibold">
              {prompt.title.slice(0, 80) +
                `${prompt.title.length > 80 ? "..." : ""}`}
            </h4>
            <p className="text-sm text-gray-400">
              {prompt.content.slice(0, 200) +
                `${prompt.content.length > 200 ? "..." : ""}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PromptsList
