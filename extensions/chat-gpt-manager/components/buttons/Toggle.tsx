

const Toggle = ({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: Function
}) => {
  return (
    <div
      onClick={() => setIsOpen((prev: boolean) => !prev)}
      className={` relative cursor-pointer w-[65px] min-h-[25px] ${isOpen ? "bg-white" : "bg-gray-500"} rounded-full`}>
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${isOpen ? "translate-x-12 bg-black" : "translate-x-0"} smooth-transition left-[3px] w-[22px] h-[22px] rounded-full bg-black`}
      />
    </div>
  )
}

export default Toggle
