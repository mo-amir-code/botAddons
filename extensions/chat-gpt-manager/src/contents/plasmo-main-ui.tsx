import Provider from "@/components/provider"
import Sidebar from "@/components/sidebar"
import { SIDEBAR_ELEMENT_INJECT_ID } from "@/config/constants"
import { SlashCommand } from "@/sections"
import { setAuthToken } from "@/utils/services/auth"
import cssText from "data-text:~style.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"
import { useEffect } from "react"

export const getStyle = () => {
  const baseFontSize = 12
  let updatedCssText = cssText.replaceAll(":root", ":host(botaddons-ui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixels = parseFloat(remValue) * baseFontSize
    return `${pixels}px`
  })
  const style = document.createElement("style")
  style.textContent = updatedCssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://chatgpt.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector(SIDEBAR_ELEMENT_INJECT_ID),
  insertPosition: "afterbegin"
})

export const getShadowHostId: PlasmoGetShadowHostId = () => "botaddons-inline"

function PlasmoMainUI() {
  useEffect(() => {
    setAuthToken()
  }, [])

  return (
    <Provider>
      <Sidebar />
      <SlashCommand />
    </Provider>
  )
}

export default PlasmoMainUI
