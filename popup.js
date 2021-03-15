let toggleExtension = document.getElementById("toggleExtension");
let enterNameTextBox = document.getElementById("enterNameTextBox");

chrome.storage.sync.get(null, (resp) => {
    toggleExtension.checked = resp.isExtensionEnabled;
    enterNameTextBox.value = resp.nameToCheck.toLowerCase();
    console.log("updated details from storage")
});

function isValidName(name) {
    if (name && name.trim())
        return true;
    else
        return false;
}

toggleExtension.addEventListener("change", async () => {
    if (toggleExtension.checked && !isValidName(enterNameTextBox.value)) {
        document.getElementById("extraInfo").style.visibility = "visible";
        toggleExtension.checked = false;
    } else {
        document.getElementById("extraInfo").style.visibility = "hidden";
        return chrome.storage.sync.set({ "isExtensionEnabled": (toggleExtension.checked), "nameToCheck": enterNameTextBox.value }, myCheckfunc);
    }
});

async function myCheckfunc() {
    if (toggleExtension.checked) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (mytab) {
            chrome.tabs.sendMessage(mytab[0].id, { greeting: "startCheckingName" }, function (response) {
                try {
                    console.log(response.farewell);
                } catch (err) {
                    console.log(err);
                }
            });
        });
    } else {
        chrome.tabs.query({ active: true, currentWindow: true }, function (mytab) {
            chrome.tabs.sendMessage(mytab[0].id, { greeting: "stopCheckingName" }, function (response) {
                try {
                    console.log(response.farewell);
                } catch (err) {
                    console.log(err);
                }
            });
        });
    }
}
