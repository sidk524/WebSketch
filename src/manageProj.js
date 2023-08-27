function loadSettings() {
    const websitePathInput = document.getElementById("websitePathID")
    const portNumInput = document.getElementById("portNumID")
    const projNameInput = document.getElementById("projNameID")

    projectName = window.location.href.split("?name=")[1]
    console.log(projectName)
    var getConfigSettings = new XMLHttpRequest()
    getConfigSettings.open("POST", "http://localhost:3002/getconfigsettings", true)
    getConfigSettings.setRequestHeader("Accept", "application/json");
    getConfigSettings.setRequestHeader("Content-Type", "application/json");
    var data = `{"name": "${projectName}"}`
    getConfigSettings.send(data)
    getConfigSettings.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var settings = JSON.parse(this.responseText)
            websitePathInput.value = settings.websitePath
            portNumInput.value = settings.port
            projNameInput.value = settings.projectName
            // disable all of the inputs
            

        }
    }
}


function formatWebsitePath(path) {
    // escape all of the backslashes
    path = path.replace(/\\/g, "\\\\")
    // escape all of the double quotes
    path = path.replace(/"/g, '\\"')
    return path

}


function saveSettings() {
    const websitePathInput = document.getElementById("websitePathID")
    const portNumInput = document.getElementById("portNumID")
    const projNameInput = document.getElementById("projNameID")
    event.preventDefault();
    var saveConfigSettings = new XMLHttpRequest()
    saveConfigSettings.open("POST", "http://localhost:3002/saveconfigsettings", true)
    saveConfigSettings.setRequestHeader("Accept", "application/json");
    saveConfigSettings.setRequestHeader("Content-Type", "application/json");

    var data = `{"oldName":"${projectName}", "configdata": { "websitePath": "${formatWebsitePath(websitePathInput.value)}", "port": "${portNumInput.value}", "projectName": "${projNameInput.value}"}}`
    console.log(data)
    saveConfigSettings.send(data)
    saveConfigSettings.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var settings = JSON.parse(this.responseText)
            alert("Settings saved!")
        }
    }
}



loadSettings()