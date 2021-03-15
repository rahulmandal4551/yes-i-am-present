let myIntervalVar;
let tryCount = 0;

let nameToCheck = "myName";
let checkIntervalInSeconds = 10;
let muteAgainInSecs = 5;

chrome.storage.sync.get(null, (resp) => {
    nameToCheck = resp.nameToCheck.toLowerCase();
    checkIntervalInSeconds = resp.checkIntervalInSeconds;
    muteAgainInSecs = resp.muteAgainInSecs;
    console.log(resp);
});

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (message.greeting == "startCheckingName")
        {
            console.log("%cStarting Name Checking", "color:yellow");
            chrome.storage.sync.get(null, (resp) => {
                nameToCheck = resp.nameToCheck.toLowerCase();
                // checkIntervalInSeconds = resp.checkIntervalInSeconds;
                // muteAgainInSecs = resp.muteAgainInSecs;
                console.log("updated details from storage");
                startCheckIfMyNameIsCalled(nameToCheck, checkIntervalInSeconds, muteAgainInSecs);
            });
            sendResponse({ farewell: "Started checking names" });
        }
        else if (message.greeting == "stopCheckingName") {
            console.log("%cStopping Name Checking", "color:yellow");
            stopCheckIfMyNameIsCalled();
            sendResponse({ farewell: "Stopped checking names" });
        }
    }
);

function startCheckIfMyNameIsCalled(nameToCheck, checkIntervalInSeconds, muteAgainInSecs) {
    if (!myIntervalVar) {
        myIntervalVar = setInterval(function () {
            console.log(`Checking again...(${tryCount++})`);
            
            try {
                let captionToggleButton = document.getElementsByClassName("n8i9t")[0];
                if (captionToggleButton.innerText.includes("Turn on captions")) // click caption button if caption is not enabled
                    captionToggleButton.click();
            } catch (e) {
                console.log("%cERROR: Could not find Caption Button in the DOM. Please turn on captions manually\n" + e, "color:red");
            }

            let conversation = ""
            try {
                // getting caption text
                conversation = document.getElementsByClassName("a4cQT")[0].innerText;
                console.log(conversation);
                conversation = conversation.toLowerCase();
            } catch (e) {
                console.log("%cERROR: Could not find Caption Display Area in the DOM.\n" + e, "color:red");
            }

            if (conversation.includes(nameToCheck)) {
                console.log("%cFound your Name!!! \n" + conversation, "color:green");
                try {
                    let muteButton = document.querySelector("#ow3 > div.T4LgNb > div > div:nth-child(9) > div.crqnQb > div.rG0ybd.LCXT6 > div.q2u11 > div.a1GRr > div > div > div");
                    if (muteButton.ariaLabel.includes("Turn on microphone")) { // if mic is off (muted), turn it on
                        muteButton.click();

                        setTimeout(() => {  // turn off mic after muteAgainInSecs
                            if (muteButton.ariaLabel.includes("Turn off microphone"))
                                muteButton.click();
                        }, muteAgainInSecs * 1000);
                    }
                } catch (e) {
                    console.log("%cERROR: Could not find the mic(mute) button in the DOM.\n" + e, "color:red");
                }
            }
        }, (checkIntervalInSeconds * 1000));
    }
}

function stopCheckIfMyNameIsCalled() {
    clearInterval(myIntervalVar);
    myIntervalVar = null;
}
