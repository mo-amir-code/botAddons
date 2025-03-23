import { PromptsList } from "@/components/slash"
import { PROMPT_LIST_ELEMENT_INJECT_ID } from "@/config/constants"
import cssText from "data-text:~style.css"
import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const SlashCommand = () => {
  const observerRef = useRef(null)
  const rootRef = useRef(null)

  const cleanup = () => {
    if (rootRef.current) {
      rootRef.current.unmount()
      rootRef.current = null
    }
    const container = document.getElementById("prompt-list-container")
    if (container) container.remove()
  }

  // Function to inject PromptsList
  const initiateSlashCommand = () => {
    const promptListElement = document.querySelector(
      PROMPT_LIST_ELEMENT_INJECT_ID
    )

    if (promptListElement) {
      // Clean up any existing injection
      cleanup()

      // Create and style the container
      const container = document.createElement("div")
      container.id = "prompt-list-container"
      container.style.width = "100%"
      container.style.position = "absolute"
      container.style.left = "0"
      container.style.bottom = "105%"
      promptListElement.appendChild(container)

      // Render PromptsList
      const root = createRoot(container)
      root.render(<PromptsList />)
      rootRef.current = root
    }
  }

  useEffect(() => {
    try {
      // Add runtime message listener
      const handleMessage = (message, sender, sendResponse) => {
        if (message.type === "URL_UPDATED") {
          initiateSlashCommand()
        }
      }
      chrome.runtime.onMessage.addListener(handleMessage)

      // Set up MutationObserver to watch for DOM changes
      observerRef.current = new MutationObserver((mutations) => {
        const promptListElement = document.querySelector(
          PROMPT_LIST_ELEMENT_INJECT_ID
        )
        if (
          promptListElement &&
          !document.getElementById("prompt-list-container")
        ) {
          initiateSlashCommand() // Re-inject if target exists but container is missing
        } else if (!promptListElement) {
          cleanup() // Clean up if target is gone
        }
      })

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true
      })

      // Initial injection
      initiateSlashCommand()

      // Cleanup on unmount
      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage)
        if (observerRef.current) observerRef.current.disconnect()
        cleanup()
      }
    } catch (error) {
      console.error("Error in SlashCommand.tsx:", error)
    }
  }, []) // Empty dependency array since we only want this to run on mount/unmount

  return null
}

export default SlashCommand
