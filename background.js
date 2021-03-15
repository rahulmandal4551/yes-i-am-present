let nameToCheck = "myName";
let checkIntervalInSeconds = 10;
let muteAgainInSecs = 5;
let isExtensionEnabled = false

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({"isExtensionEnabled": isExtensionEnabled, "nameToCheck": nameToCheck, "checkIntervalInSeconds": checkIntervalInSeconds, "muteAgainInSecs": muteAgainInSecs});
    console.log(`%cnameToCheck and checkIntervalInSeconds is intialized to ${nameToCheck} and ${checkIntervalInSeconds}`, `color:green`);
});
