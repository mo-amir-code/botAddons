import type { FilerChatsType, FormatTimestampType } from "../types/services"

const formatTimestamp = ({ timestamp, type }: FormatTimestampType) => {
  const date = new Date(timestamp)

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  // Extract time components
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const isAM = hours < 12
  const period = isAM ? "AM" : "PM"

  // Convert hours to 12-hour format
  hours = hours % 12 || 12 // If 0, set to 12

  // Construct date and time strings
  const dateStr = `${day}/${month}/${year}`
  const timeStr = `${hours}:${minutes} ${period}`

  // Return based on type
  if (type === "date") return dateStr
  if (type === "time") return timeStr
  if (type === "both") return `${dateStr} ${timeStr}`

  return null
}

const stringTimeIntoNumber = (
  timestamp: string,
): number => {
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp format")
  }
  return date.getTime()
}

const filterChats = ({ conversations, sort, filter }: FilerChatsType) => {
  let updatedConversations = conversations
  if (filter === "removeEmptyConversations") {
    updatedConversations = updatedConversations.filter((c) => c.title.length)
  }
  return updatedConversations.sort((a, b) =>
    sort === "asc"
      ? a.update_time - b.update_time
      : b.update_time - a.update_time
  )
}

function removeDuplicatesItemsById(arr: { id: string }[]) {
  const seen = new Set()

  // Use filter to keep only objects with unique ids
  return arr.filter((item) => {
    if (seen.has(item.id)) {
      return false // If the id is already in the Set, it's a duplicate
    } else {
      seen.add(item.id) // Otherwise, add the id to the Set
      return true // Keep the item
    }
  })
}

export {
  formatTimestamp,
  filterChats,
  removeDuplicatesItemsById,
  stringTimeIntoNumber
}
