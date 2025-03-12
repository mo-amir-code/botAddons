export type AuthSessionUserType = {
  id: string
  email: string
  image: string
  picture: string
}

export interface AuthSessionType {
  user: AuthSessionUserType
  accessToken: string
  expires: string
}

const setAuthToken = async () => {
  const response = await fetch("/api/auth/session")
  const sessionData = (await response.json()) as AuthSessionType
  setDataInLocalStorage({
    key: "cat",
    data: sessionData?.accessToken
  })
  setDataInLocalStorage({
    key: "user",
    data: sessionData?.user
  })
}

type LocalStorageKeyTypes = "cat" | "user" | "prompts" | "promptsTrigger" | "language"

const setDataInLocalStorage = ({
  key,
  data
}: {
  key: LocalStorageKeyTypes
  data: any
}) => {
  chrome.storage.local.set({
    [key]: data
  })
}

const getDataFromLocalStorage = async (key: LocalStorageKeyTypes) => {
  return ((await chrome.storage.local.get(key)) as any)?.[key]
}

export {
  setAuthToken,
  setDataInLocalStorage,
  getDataFromLocalStorage
}
