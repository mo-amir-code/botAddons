import axios from "axios"
import { getAuthToken } from "../auth"
import type { ConversationUpdateType } from "@/utils/types/services/queries"


const getConversations = async ({ offset = 0, isArchived }: { offset?: number, isArchived?: boolean }) => {
    const token = await getAuthToken()
    return await axios.get(
        `https://chatgpt.com/backend-api/conversations?offset=${offset}&limit=100&order=updated&s=true&is_archived=${isArchived ? true : false}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

const getAllConversations = async ({ dispatch, chatsLoaded, archive = "unarchive" }: { dispatch: Function, chatsLoaded: number, archive?: "archive" | "unarchive" }) => {
    let conversations = [];
    let allItems: any

    const res = await getConversations({ offset: 0, isArchived: archive === "archive" ? true : false })
    allItems = res?.data?.total

    conversations = [...res.data.items]

    allItems = Math.ceil(allItems / 100)

    conversations = [
        conversations,
        ...(await Promise.all(
            Array.from({
                length: allItems
            }).map(async (_, idx) => {
                if (idx === 0) return [];

                const res = await getConversations({ offset: 100 * idx, isArchived: archive === "archive" ? true : false })

                let percentage = ((idx + 1) / allItems) * 100
                percentage = Math.floor(percentage)

                if (chatsLoaded < percentage && archive === "unarchive")
                    dispatch({ type: "CHAT_LOADED", payload: percentage })

                return res?.data?.items || []
            })
        ))
    ]

    if (archive === "unarchive")
        dispatch({ type: "CHAT_LOADED", payload: 100 })

    conversations = conversations.flat().map((c) => {
        return {
            id: c.id,
            title: c.title,
            is_archived: c.is_archived,
            messages: [],
            update_time: new Date(c.update_time).getTime()
        }
    })

    return conversations
}

const updateConversation = async ({ conversationId, archive, isVisible }: ConversationUpdateType) => {
    const token = await getAuthToken()
    let data = {};

    if (archive === "archive") data["is_archived"] = true;
    else if (archive === "unarchive") data["is_archived"] = false;

    if (isVisible) data["is_visible"] = false;

    if (!archive && !isVisible) return;

    await axios.patch(
        `https://chatgpt.com/backend-api/conversation/${conversationId}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export {
    getConversations,
    updateConversation,
    getAllConversations
}