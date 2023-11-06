chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension installed.");
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getSelectedText") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      function: function () {
        const selectedText = window.getSelection().toString();
        return selectedText;
      }
    }, function (result) {
      sendResponse(result[0]);
    });
    return true;
  }
});
