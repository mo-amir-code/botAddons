import { dbAndStores } from "@/utils/constants"

// Define types for better TypeScript support
interface DBConfig {
  dbName: string
  storeName: string
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type StoredResponse = {
  id: string
  update_time: string
  account_id: string | null
  is_archived: boolean
  messages: Message[]
  title: string
}

// Constants
const DB_NAME = dbAndStores[0].dbName
const STORE_NAME = dbAndStores[0].storeName
const DB_VERSION = 4

/**
 * Opens the IndexedDB database connection
 * @returns Promise resolving to the database instance
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
      }
    }

    request.onsuccess = (event: Event) =>
      resolve((event.target as IDBOpenDBRequest).result)
    request.onerror = (event: Event) =>
      reject((event.target as IDBOpenDBRequest).error)
  })
}

/**
 * Stores API responses in IndexedDB
 * @param responses Array of API responses to store
 * @returns Promise resolving to success message
 */
async function storeResponses(
  responses: Omit<StoredResponse, "id">[]
): Promise<string> {
  const db: IDBDatabase = await openDB()
  const transaction: IDBTransaction = db.transaction(STORE_NAME, "readwrite")
  const store: IDBObjectStore = transaction.objectStore(STORE_NAME)

  responses.forEach((response) => {
    store.add(response)
  })

  return new Promise<string>((resolve, reject) => {
    transaction.oncomplete = () => resolve("Responses stored successfully")
    transaction.onerror = () => reject("Failed to store responses")
  })
}

/**
 * Retrieves all stored conversations from IndexedDB
 * @returns Promise resolving to array of stored conversations
 */
async function getStoredConversations(): Promise<StoredResponse[]> {
  const db: IDBDatabase = await openDB()

  return new Promise<StoredResponse[]>((resolve, reject) => {
    const transaction: IDBTransaction = db.transaction(STORE_NAME, "readonly")
    const store: IDBObjectStore = transaction.objectStore(STORE_NAME)
    const request: IDBRequest<StoredResponse[]> = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject("Failed to retrieve conversations")
  })
}

/**
 * Deletes a specific conversation by its ID
 * @param id The ID of the conversation to delete
 * @returns Promise resolving to success message
 */
async function deleteConversation(id: number): Promise<string> {
  const db: IDBDatabase = await openDB()
  const transaction: IDBTransaction = db.transaction(STORE_NAME, "readwrite")
  const store: IDBObjectStore = transaction.objectStore(STORE_NAME)

  store.delete(id)

  return new Promise<string>((resolve, reject) => {
    transaction.oncomplete = () =>
      resolve(`Conversation with ID ${id} deleted successfully`)
    transaction.onerror = () =>
      reject(`Failed to delete conversation with ID ${id}`)
  })
}

/**
 * Clears all stored conversations from the database
 * @returns Promise resolving to success message
 */
async function clearAllConversations(): Promise<string> {
  const db: IDBDatabase = await openDB()
  const transaction: IDBTransaction = db.transaction(STORE_NAME, "readwrite")
  const store: IDBObjectStore = transaction.objectStore(STORE_NAME)

  store.clear()

  return new Promise<string>((resolve, reject) => {
    transaction.oncomplete = () =>
      resolve("All conversations cleared successfully")
    transaction.onerror = () => reject("Failed to clear conversations")
  })
}

export {
  openDB,
  storeResponses,
  getStoredConversations,
  deleteConversation,
  clearAllConversations,
  type StoredResponse
}
