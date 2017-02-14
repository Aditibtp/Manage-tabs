var totalTabs = 0;
var getTotalTabsInWindow = function (){
  chrome.tabs.getAllInWindow(
      function(tabsArray) {
        totalTabs = tabsArray.length;
        chrome.browserAction.setBadgeText({text: " "+ totalTabs});
  });
  return totalTabs;
};
chrome.windows.onFocusChanged.addListener(function(){
  getTotalTabsInWindow();
});
chrome.tabs.onCreated.addListener(function() {
  totalTabs = totalTabs + 1;
  chrome.browserAction.setBadgeText({text: "  "+ totalTabs});
});
chrome.tabs.onRemoved.addListener(function() {
  totalTabs = totalTabs - 1;
  chrome.browserAction.setBadgeText({text: "  "+ totalTabs});
});
/*chrome.windows.onCreated.addListener(function(){
  totalTabs = 0;
  chrome.browserAction.setBadgeText({text: "  "+totalTabs});
});*/

chrome.browserAction.setBadgeText({text: "  "+ getTotalTabsInWindow()});
