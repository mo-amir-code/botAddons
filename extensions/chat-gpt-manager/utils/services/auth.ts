import type { Dispatch } from "react"
import type { ReducerActionType, UserInfoType } from "../types/context"

export type AuthSessionUserType = {
  id: string
  name: string
  email: string
  image: string
  picture: string
}

export interface AuthSessionType {
  user: AuthSessionUserType
  accessToken: string
  expires: string
}

export type LocalStorageKeyTypes =
  | "cat"
  | "user"
  | "prompts"
  | "promptsTrigger"
  | "language"
  | "folders"

const getUserInfo = async (): Promise<UserInfoType> => {
  return ((await chrome.storage.local.get("user")) as any)?.["user"]
}

const setAuthToken = async (dispatch:Dispatch<ReducerActionType>) => {
  try {
    const response = await fetch("/api/auth/session")

    const sessionData = (await response.json()) as AuthSessionType

    setDataInLocalStorage({
      key: "user",
      data: sessionData?.user
    })

    
    setDataInLocalStorage({
      key: "cat",
      data: sessionData?.accessToken
    })


    dispatch({type: "CHATGPT_USER_INFO", payload: sessionData?.user})
  } catch (error) {
    console.error(error)
  }
}

const setDataInLocalStorage = async ({
  key,
  data,
  id
}: {
  key: LocalStorageKeyTypes
  data: any
  id?: string
}) => {
  let finalKey =
    (key === "folders" || key === "prompts") && id ? `${key}-${id}` : key
  const userInfo = await getUserInfo()
  if (userInfo && key != "user" && key != "cat") {
    finalKey += `-${userInfo.id}`
  }
  chrome.storage.local.set({
    [finalKey]: data
  })
}

const getDataFromLocalStorage = async (
  key: LocalStorageKeyTypes,
  id?: string
) => {
  let finalKey =
    (key === "folders" || key === "prompts") && id ? `${key}-${id}` : key
  const userInfo = await getUserInfo()
  if (userInfo && key != "user" && key != "cat") {
    finalKey += `-${userInfo.id}`
  }
  return ((await chrome.storage.local.get(finalKey)) as any)?.[finalKey]
}

const deleteDataFromLocalStorage = async (
  key: LocalStorageKeyTypes,
  id?: string
) => {
  let finalKey =
    (key === "folders" || key === "prompts") && id ? `${key}-${id}` : key
  const userInfo = await getUserInfo()
  if (userInfo && key != "user" && key != "cat") {
    finalKey += `-${userInfo.id}`
  }
  return await chrome.storage.local.remove(finalKey)
}

export {
  setAuthToken,
  setDataInLocalStorage,
  getDataFromLocalStorage,
  deleteDataFromLocalStorage
}
