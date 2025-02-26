import type { ReactNode } from "react"

const SearchField = ({
  func,
  placeholder,
  defaultValue,
  child
}: {
  func: Function
  placeholder: string
  defaultValue?: string
  child?: ReactNode
}) => {
  return (
    <div className="mb-4 p-2 flex items-center rounded-md border border-white/60">
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoFocus
        className="w-full bg-transparent outline-none text-white/80"
        onChange={(e: any) => func(e.target.value)}
      />
      {child}
    </div>
  )
}

export default SearchField
