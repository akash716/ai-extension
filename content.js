chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getText") {
        let extractedText = document.body.innerText.trim();
        
        if (!extractedText) {
            console.error("No text found on page.");
            sendResponse({ text: "Error: No text found on this page." });
        } else {
            sendResponse({ text: extractedText });
        }
    }
});
