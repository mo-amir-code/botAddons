


const setAuthToken = async () => {
    const response = await fetch("/api/auth/session")
    const sessionData = await response.json();
    chrome.storage.local.set({ cat: sessionData?.accessToken });
}

const getAuthToken = async () => {
    return (await chrome.storage.local.get("cat") as any)?.cat;
}

export {
    setAuthToken,
    getAuthToken
}