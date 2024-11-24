import { useExtension } from "@/contexts/extensionContext"
import React, { useEffect } from "react"

const Sidebar = () => {
  const { extensionTheme, setExtensionTheme } = useExtension()

  const getCssVariable = (name: string) => {
    const rootStyle = getComputedStyle(document.documentElement)
    return rootStyle.getPropertyValue(name).trim()
  }
  const backgroundColor = getCssVariable("--main-surface-primary")

  if (backgroundColor === "#fff") {
    setExtensionTheme("light")
  } else {
    setExtensionTheme("dark")
  }

  useEffect(() => {
    const fetchNow = async () => {
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {method: "POST"});
      console.log(res);
    }
    fetchNow();
  }, []);

  return (
    <main className={`antialiased ${extensionTheme}`}>
      <h3 className="text-[12px] p-2 cursor-pointer text-ellipsis font-semibold">
        ChatGPT Manager - Premium
      </h3>
      <ol className="text-white space-y-2">
        <li className="py-2 px-2 rounded-xl bg-gray-500/15" >Plasmo Extension Developer</li>
        <li className="py-2 px-2 rounded-xl bg-gray-500/15" >Plasmo Extension Developer</li>
        <li className="py-2 px-2 rounded-xl bg-gray-500/15" >Plasmo Extension Developer</li>
      </ol>
    </main>
  )
}

export default Sidebar
