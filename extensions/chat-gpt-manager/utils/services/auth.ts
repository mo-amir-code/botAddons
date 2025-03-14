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

export type LocalStorageKeyTypes =
  | "cat"
  | "user"
  | "prompts"
  | "promptsTrigger"
  | "language"
  | "folders"

const setDataInLocalStorage = ({
  key,
  data,
  id
}: {
  key: LocalStorageKeyTypes
  data: any
  id?: string
}) => {
  const finalKey = ((key === "folders" || key === "prompts") && id) ? `${key}-${id}` : key;
  chrome.storage.local.set({
    [finalKey]: data
  })
}

const getDataFromLocalStorage = async (key: LocalStorageKeyTypes, id?:string) => {
  const finalKey = ((key === "folders" || key === "prompts") && id) ? `${key}-${id}` : key;
  return ((await chrome.storage.local.get(finalKey)) as any)?.[finalKey]
}

const deleteDataFromLocalStorage = async (key: LocalStorageKeyTypes, id?:string) => {
  const finalKey = ((key === "folders" || key === "prompts") && id) ? `${key}-${id}` : key;
  return ((await chrome.storage.local.remove(finalKey)));
}

export { setAuthToken, setDataInLocalStorage, getDataFromLocalStorage, deleteDataFromLocalStorage }
