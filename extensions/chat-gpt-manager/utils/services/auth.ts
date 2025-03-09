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
  chrome.storage.local.set({
    cat: sessionData?.accessToken
  })
  chrome.storage.local.set({
    user: sessionData.user
  })
}

const getAuthToken = async () => {
  return ((await chrome.storage.local.get("cat")) as any)?.cat
}

const getSessionUserInfo = async () => {
  return ((await chrome.storage.local.get("user")) as any)?.user
}

const setPrompts = (data: any) => {
  chrome.storage.local.set({
    prompts: data
  })
}

const getPrompts = async () => {
  const data = ((await chrome.storage.local.get("cat")) as any)?.prompts
  return data
}

export {
  setAuthToken,
  getAuthToken,
  getSessionUserInfo,
  setPrompts,
  getPrompts
}
