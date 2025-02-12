const SearchField = ({ func, placeholder }: { func: Function, placeholder: string }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      autoFocus
      className="w-full bg-transparent outline-none text-white/80"
      onChange={(e: any) => func(e.target.value)}
    />
  )
}

export default SearchField
