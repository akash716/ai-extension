const GEMINI_API_KEY = "AIzaSyA98t-J0HsJVeCZmF7xEHE-XpL3b8pr61E";  // 🔹 Replace with your actual Google Gemini API Key

document.getElementById("extract").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
            document.getElementById("extractedText").value = "Error: No active tab found.";
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => document.body.innerText
        }).then((results) => {
            if (!results || results.length === 0 || !results[0].result) {
                document.getElementById("extractedText").value = "Error: Unable to extract text.";
                return;
            }

            document.getElementById("extractedText").value = results[0].result;
        }).catch((error) => {
            console.error("Script execution failed:", error);
            document.getElementById("extractedText").value = "Error: Failed to extract text.";
        });
    });
});

document.getElementById("ask").addEventListener("click", async () => {
    let extractedText = document.getElementById("extractedText").value;
    let question = document.getElementById("question").value;
    
    if (!extractedText.trim()) {
        document.getElementById("answer").innerText = "Error: No text extracted.";
        return;
    }
    if (!question.trim()) {
        document.getElementById("answer").innerText = "Error: Please enter a question.";
        return;
    }

    document.getElementById("answer").innerText = "Thinking...";  // Show loading message

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Context: ${extractedText}\n\nQuestion: ${question}` }] }]
            }),
        });

        const data = await response.json();
        
        if (data && data.candidates && data.candidates.length > 0) {
            document.getElementById("answer").innerText = data.candidates[0].content.parts[0].text;
        } else {
            document.getElementById("answer").innerText = "Error: No response from Gemini API.";
        }
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        document.getElementById("answer").innerText = "Error: Failed to fetch answer.";
    }
});


