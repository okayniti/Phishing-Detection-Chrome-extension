chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const apiKey = "YOUR_GOOGLE_SAFE_BROWSING_API_KEY";
        const request = {
            client: { clientId: "phishguard", clientVersion: "1.0" },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: tab.url }]
            }
        };

        try {
            let response = await fetch(
                `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                    headers: { "Content-Type": "application/json" }
                }
            );

            let data = await response.json();
            if (data.matches) {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "icon.png",
                    title: "⚠️ Phishing Alert!",
                    message: "This website may be dangerous!",
                    priority: 2
                });
            }
        } catch (error) {
            console.error("Error checking URL:", error);
        }
    }
});
