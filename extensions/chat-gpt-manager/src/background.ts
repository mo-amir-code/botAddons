// chrome.runtime.onInstalled.addListener(() => {
//     // Default user status is not logged in
//     chrome.storage.local.set({ isLoggedIn: false });
// });

// Listen for events from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkAuthStatus") {
        chrome.storage.local.get("isLoggedIn", (data) => {
            if (!data.isLoggedIn) {
                // If the user is not logged in, open the popup automatically
                // chrome.windows.create({
                //     url: chrome.runtime.getURL("popup.html"),
                //     type: "popup",
                //     width: 400,
                //     height: 600,
                // });
                chrome.action.openPopup();
            }
        });
    }
});
