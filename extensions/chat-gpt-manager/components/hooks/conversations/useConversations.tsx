import { useExtension } from "@/contexts/extensionContext"
import { getDataFromLocalStorage } from "@/utils/services/auth"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"

import { deleteConversations, storeResponses } from "./helper"

const API_ENDPOINT = "https://chatgpt.com/backend-api/conversation"
const MAX_CONCURRENT_REQUESTS = 100

const useConversations = () => {
  const [conversationIds, setConversationIds] = useState<string[]>([])
  const [transformedData, setTransformedData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const {
    dispatch,
    allConversations,
    conversations,
    isConversationsLoaded,
    chatsLoaded
  } = useExtension()

  // Transform a single API response to target format
  const transformResponse = useCallback((apiResponse: any) => {
    // Validate the API response structure
    if (!apiResponse || !apiResponse.conversation_id || !apiResponse.mapping) {
      throw new Error("Invalid API response structure")
    }

    // Initialize the result object with conversation metadata
    let result = {
      id: apiResponse.conversation_id,
      update_time: new Date(apiResponse.update_time * 1000).toISOString(),
      account_id: null,
      is_archived: apiResponse.is_archived || false,
      title: apiResponse.title || "Untitled Conversation",
      messages: []
    }

    // Traverse the conversation tree from current_node to root
    let currentId = apiResponse.current_node
    let messages = []

    while (currentId) {
      const node = apiResponse.mapping[currentId]
      if (!node) break // Exit if node is missing

      const message = node.message
      if (
        message &&
        (message.author.role === "user" ||
          message.author.role === "assistant") &&
        message.content?.content_type === "text" &&
        !message.metadata?.is_visually_hidden_from_conversation
      ) {
        messages.push({
          id: currentId,
          role: message.author.role,
          content: message.content.parts[0] || ""
        })
      }

      currentId = node.parent // Move to the parent node
    }

    // Reverse the messages to get chronological order (earliest first)
    result.messages = messages.reverse()

    return result
  }, [])

  // Configure axios with retry and timeout settings for reliability
  const configureAxios = useCallback(async () => {
    const token = await getDataFromLocalStorage("cat")

    // Create axios instance with configured defaults for better request handling
    const api = axios.create({
      timeout: 30000, // 30-second timeout
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    // Add response interceptor for retry logic
    api.interceptors.response.use(null, async (error) => {
      const { config } = error

      // Only retry GET requests
      if (!config || !config.method || config.method.toLowerCase() !== "get") {
        return Promise.reject(error)
      }

      // Set retry count
      config.__retryCount = config.__retryCount || 0

      // Maximum retry attempts
      if (config.__retryCount >= 2) {
        return Promise.reject(error)
      }

      // Increase retry count
      config.__retryCount += 1

      // Create new promise to handle retry
      const backoffDelay = config.__retryCount * 1000
      await new Promise((resolve) => setTimeout(resolve, backoffDelay))

      // Return the retry request
      return api(config)
    })

    return api
  }, [])

  // Fetch a single conversation
  const fetchConversation = useCallback(
    async (api: any, conversationId: string) => {
      try {
        const response = await api.get(
          `${API_ENDPOINT}/${conversationId}?s=true`
        )
        return response.data
      } catch (error: any) {
        console.error(
          `Error fetching conversation ${conversationId}:`,
          error.message
        )
        return null
      }
    },
    []
  )

  // Process conversations in parallel with controlled concurrency
  const processAllConversations = useCallback(async () => {
    if (conversationIds.length === 0) return []

    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Configure axios with authentication and retry logic
      const api = await configureAxios()

      //   console.log(`Processing ${conversationIds.length} conversations with max concurrency of ${MAX_CONCURRENT_REQUESTS}...`)

      const results: any[] = []
      let completedCount = 0

      // Process all conversations with controlled concurrency
      const processInBatches = async () => {
        // Create batches of MAX_CONCURRENT_REQUESTS
        for (
          let i = 0;
          i < conversationIds.length;
          i += MAX_CONCURRENT_REQUESTS
        ) {
          const batch = conversationIds.slice(i, i + MAX_CONCURRENT_REQUESTS)

          // Process this batch concurrently
          const batchPromises = batch.map((id) => fetchConversation(api, id))
          const batchResponses = await Promise.all(batchPromises)

          // Transform successful responses
          for (const response of batchResponses) {
            if (response) {
              try {
                const transformed = transformResponse(response)
                if (transformed) {
                  results.push(transformed)
                }
              } catch (err) {
                console.error("Error transforming response:", err)
              }
            }

            // Update progress
            completedCount++
            const newProgress = Math.round(
              (completedCount / conversationIds.length) * 100
            )
            setProgress(newProgress)
            dispatch({ type: "CHAT_LOADED", payload: newProgress })
          }
        }

        return results
      }

      dispatch({ type: "CHAT_LOADED", payload: 0 })
      const processedResults = await processInBatches()
      dispatch({ type: "CHAT_LOADED", payload: 100 })

      //   console.log(`Successfully processed ${processedResults.length} out of ${conversationIds.length} conversations`)
      setTransformedData(processedResults)
      return processedResults
    } catch (error: any) {
      console.error("Error in parallel processing:", error)
      setError(error.message || "Failed to process conversations")
      return []
    } finally {
      setIsLoading(false)
      setProgress(100)
    }
  }, [conversationIds, configureAxios, fetchConversation, transformResponse])

  // Handle fetching all conversations manually
  const fetchAllConversations = useCallback(async () => {
    if (allConversations.length === 0) {
      setError("No conversations available")
      return []
    }

    // Set conversation IDs if not already set
    if (conversationIds.length === 0) {
      const ids = allConversations.map((conv) => conv.id)
      setConversationIds(ids)
      return processAllConversations()
    } else {
      return processAllConversations()
    }
  }, [allConversations, conversationIds, processAllConversations])

  // Auto-fetch when conversation IDs are available
  useEffect(() => {
    if (allConversations.length > 0 && conversationIds.length === 0) {
      let allConversationIds = allConversations.map((conv) => conv.id)
      allConversationIds = allConversationIds.filter(
        (id) => !conversations.some((it) => it.id == id)
      )
      if (isConversationsLoaded) {
        setConversationIds(allConversationIds)
        if (allConversationIds.length === 0) {
          setProgress(100)
        }
      }
    }
  }, [allConversations, conversations, isConversationsLoaded])

  useEffect(() => {
    if (
      conversationIds.length > 0 &&
      transformedData.length === 0 &&
      !isLoading
    ) {
      processAllConversations()
    }
  }, [
    conversationIds,
    transformedData.length,
    isLoading,
    processAllConversations
  ])

  useEffect(() => {
    try {
      if (transformedData.length) {
        storeResponses(transformedData).then(() => {
          dispatch({ type: "IS_CONVERSATIONS_LOADED", payload: false })
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [transformedData])

  const handleRemoveDeletedConversationsFromDB = useCallback(
    async (conversationIds: string[]) => {
      await deleteConversations(conversationIds)
    },
    []
  )

  useEffect(() => {
    if (chatsLoaded === 100 && !isLoading && progress === 100) {
      const deletedConversationsIds = conversations
        .filter((it) => !allConversations.some((conv) => conv.id == it.id))
        .map((it) => it.id)
        
      deletedConversationsIds.length &&
        handleRemoveDeletedConversationsFromDB(deletedConversationsIds)
    }
  }, [conversations, allConversations, chatsLoaded, isLoading, progress])

  return {
    transformedData,
    isLoading,
    progress,
    error,
    fetchAll: fetchAllConversations,
    reset: () => {
      setTransformedData([])
      setError(null)
      setProgress(0)
    }
  }
}

export default useConversations
