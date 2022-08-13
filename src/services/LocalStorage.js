// Save a prompt local storage
function saveResultToLocalStorage(currID, inputText, responseText) {
    if (typeof (Storage) !== "undefined") {
        // If browser supports local storage
        // Loading
        var results = JSON.parse(localStorage.getItem("results") || "[]");
        // Create new object
        var result = {
            id: currID,
            prompt: inputText,
            response: responseText
        };
        results.push(result);
        console.log("Added result for" + result.prompt);
        // Saving
        localStorage.setItem("results", JSON.stringify(results));
    } else {
        // If localStorage not supported by browser
        console.log('local storage not supported.');
    }
}

// Extract all prompt from local storage and display on UI
function loadResultsFromLocalStorage() {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage
        // Loading
        let results = JSON.parse(localStorage.getItem("results") || "[]");
        // Modifying
        //for (var i = 0; i < results.length; i++) {
            //let result = results[i];
            //renderResultToUI(result.prompt, result.response);
        //}
        return results;
    } else {
        // localStorage not supported by browser
        console.log('local storage not supported.');
    }
}

// Clear local storage
function clearLocalStorage() {
    if (typeof (Storage) !== "undefined") {
        localStorage.clear();
    } else {
        // localStorage not supported by browser
        console.log('local storage not supported.')
    }
}

export const LocalStorage = {
    saveResultToLocalStorage,
    loadResultsFromLocalStorage,
    clearLocalStorage
}
