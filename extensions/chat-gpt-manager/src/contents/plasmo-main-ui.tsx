import Provider from "@/components/provider"
import Sidebar from "@/components/sidebar"
import cssText from "data-text:~style.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId
} from "plasmo"

const INJECT_ELEMENT_ID =
  ".flex.flex-col.gap-2.text-token-text-primary.text-sm.false.mt-5.pb-2"

export const getStyle = () => {
  const baseFontSize = 12
  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
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
  element: document.querySelector(INJECT_ELEMENT_ID),
  insertPosition: "afterbegin"
})

export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline"

// chrome.runtime.sendMessage({ action: "checkAuthStatus" });

function PlasmoMainUI() {
  return (
    <Provider>
      <Sidebar />
    </Provider>
  )
}

export default PlasmoMainUI
