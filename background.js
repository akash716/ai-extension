chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractText") {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: extractPageText
      }, (results) => {
        sendResponse({ text: results[0].result });
      });
      return true;
    }
  });
  
  function extractPageText() {
    return document.body.innerText;
  }
  