// ==========================
// PROJECT MANAGEMENT FUNCTIONS
// ==========================

var projects = [];
var getServer = new XMLHttpRequest();

/**
 * Opens the project menu by fetching a list of projects from the server.
 * Updates the list of buttons to show available projects.
 * This is called when openproj.html is loaded.
 */
function openProjectMenu(){
    getServer.open("GET", "http://localhost:3002/getprojects", true);
    getServer.send();
    getServer.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            projects = JSON.parse(this.responseText);
            var buttons = document.getElementsByClassName("list-group-item-action");
            if (projects.length == 0){
                buttons[0].classList.remove("hide");
                buttons[0].innerHTML = "No projects found - go create one!";
                buttons[0].setAttribute('onclick','window.location.href = "newproj.html"');
            } else {
                for (var i = 0; i < projects.length; i++){
                    buttons[i].classList.remove("hide");
                    buttons[i].innerHTML = projects[i];
                }
            }
        }
    };
}

/**
 * Closes the currently active project's server.
 */
function closeProj(){
    event.preventDefault();
    if (document.getElementById("activeproj").innerHTML.includes("Active Webserver")){
        getServer.open("GET", "http://localhost:3002/closeserver", true);
        getServer.send();
        getServer.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var active = this.responseText;
                document.getElementById("activeproj").innerHTML = "No active webserver";
                var button = document.getElementById("runButton");
                var buttonText = document.getElementById("runButtonText");
                buttonText.innerHTML = "Run Server";
                button.value = "Run Server";
                button.setAttribute('onclick','openProject()');

            }
        };
    } else {
        alert("No server is currently active.");
    }
}

var openProjectRequest;

/**
 * Opens a project, starting its server.

 */
function openProject(){
    event.preventDefault();
    var name = getParameterByName("name");
    openProjectRequest = new XMLHttpRequest();
    openProjectRequest.open("POST", "http://localhost:3002/openproject", true);
    openProjectRequest.setRequestHeader("Accept", "application/json");
    openProjectRequest.setRequestHeader("Content-Type", "application/json");
    var data = `{"name": "${name}"}`;
    openProjectRequest.send(data);
    openProjectRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("activeproj").innerHTML = "Active Webserver: " + name + "<br>Running on internal port: "+ this.responseText + "<br>Running on external port: 80";
            var button = document.getElementById("runButton");
            var buttonText = document.getElementById("runButtonText");
            buttonText.innerHTML = "Stop Server";
            button.value = "Stop Server";
            button.setAttribute('onclick','closeProj()');

        }

    }; 
}


function delProject(name){
    event.preventDefault()
    // open a confirmation dialog
    let focusedElement = document.activeElement;

    var confirmation = confirm("Are you sure you want to delete this project?")
    focusedElement.focus();

    if (confirmation == true){
        
        var deleteProjectRequest
        var projNameInput = document.getElementById("projNameID")
        name = projNameInput.value
        deleteProjectRequest = new XMLHttpRequest()
        deleteProjectRequest.open("POST", "http://localhost:3002/delproject", true)
        deleteProjectRequest.setRequestHeader("Accept", "application/json");
        deleteProjectRequest.setRequestHeader("Content-Type", "application/json");
        var data = `{"name": "${name}"}`
        if ( document.getElementById("activeproj").innerHTML.split(" ").includes(name)){
        document.getElementById("activeproj").innerHTML = "No active webserver"
        }
        deleteProjectRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200 ) {
            var res = this.responseText
            if (res == "1") {
                alert("Project deleted successfully")
                window.location.href = "openproj.html"
            }  else if (res == "2" ){
                delProject(getParameterByName("name"))
            } else {
                alert("Project deletion failed, close any active servers and try again")
            }
            
            document.getElementById("activeproj").innerHTML = "No active webserver"

            }
        };
        deleteProjectRequest.send(data)
    }
}

// ==========================
// PROJECT SETTINGS MANAGEMENT
// ==========================

/**
 * Manages a project by opening its settings page.
 * @param {string} name - The name of the project to manage.
 */
function manageProject(name){
    if (document.getElementById("activeproj").innerHTML.includes("Active Webserver")){
        alert("Please close the active server before managing another project.");
    } else {
        window.location.href = "manageProject.html?name=" + name;
    }
}

/**
 * Loads the settings of a project from the server. Called when the settings page is opened.
 * @param {string} name - The name of the project whose settings are to be loaded.
 */
function loadSettings() {
    var name = getParameterByName("name");
    const websitePathInput = document.getElementById("websitePathID");
    const portNumInput = document.getElementById("portNumID");
    const projNameInput = document.getElementById("projNameID");

    var projectName = name;
    var getConfigSettings = new XMLHttpRequest();
    getConfigSettings.open("POST", "http://localhost:3002/getconfigsettings", true);
    getConfigSettings.setRequestHeader("Accept", "application/json");
    getConfigSettings.setRequestHeader("Content-Type", "application/json");
    var data = `{"name": "${projectName}"}`;
    getConfigSettings.send(data);
    getConfigSettings.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var settings = JSON.parse(this.responseText);
            websitePathInput.value = settings.websitePath;
            portNumInput.value = settings.port;
            projNameInput.value = settings.projectName;
        }
    };
}

/**
 * Saves the modified settings of a project to the server.
 */
function saveSettings() {
    event.preventDefault();
    console.log("Saving settings...");
    const websitePathInput = document.getElementById("websitePathID");
    const portNumInput = document.getElementById("portNumID");
    const projNameInput = document.getElementById("projNameID");
    var projectName = getParameterByName("name");
    var saveConfigSettings = new XMLHttpRequest();
    saveConfigSettings.open("POST", "http://localhost:3002/saveconfigsettings", true);
    saveConfigSettings.setRequestHeader("Accept", "application/json");
    saveConfigSettings.setRequestHeader("Content-Type", "application/json");

    var data = `{"oldName":"${projectName}", "configdata": { "websitePath": "${formatWebsitePath(websitePathInput.value)}", "port": "${portNumInput.value}", "projectName": "${projNameInput.value}"}}`;
    saveConfigSettings.send(data);
    saveConfigSettings.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Settings saved!");
        }
    };
}

// ==========================
// UTILITY FUNCTIONS
// ==========================

/**
 * Formats the website path by escaping backslashes and double quotes.
 * @param {string} path - The original website path.
 * @return {string} The formatted website path.
 */
function formatWebsitePath(path) {
    path = path.replace(/\\/g, "\\\\");
    path = path.replace(/"/g, '\\"');
    return path;
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

