import {
  useRef,
  type ReactNode,
  type Ref,
  type RefAttributes,
  type RefObject
} from "react"

const SearchField = ({
  func,
  handleSubmit,
  placeholder,
  defaultValue,
  child,
  inputRef
}: {
  func: Function
  handleSubmit?: Function
  placeholder: string
  defaultValue?: string
  child?: ReactNode
  inputRef?: RefObject<HTMLInputElement>
}) => {
  return (
    <div className="mb-4 p-2 flex items-center rounded-md border border-white/60">
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoFocus
        className="w-full bg-transparent outline-none text-white/80"
        onChange={(e: any) => func(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter" && handleSubmit) handleSubmit()
        }}
      />
      {child}
    </div>
  )
}

export default SearchField
