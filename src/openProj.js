
var projects = [];
var getServer = new XMLHttpRequest()
getServer.open("GET", "http://localhost:3002/getprojects", true)
  
getServer.send()
getServer.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
        
    projects = JSON.parse(this.responseText)
    var buttons = document.getElementsByClassName("list-group-item-action")
    for (i = 0; i<projects.length; i++){
        buttons[i].classList.remove("hide")
        buttons[i].innerHTML = projects[i]
    }
}
}


var openProjectRequest
function openProject(name){
    openProjectRequest = new XMLHttpRequest()
    openProjectRequest.open("POST", "http://localhost:3002/openproject", true)
    openProjectRequest.setRequestHeader("Accept", "application/json");
    openProjectRequest.setRequestHeader("Content-Type", "application/json");
    var data = `{"name": "${name}"}`
    
    openProjectRequest.send(data)
    openProjectRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          
          document.getElementById("activeproj").innerHTML = "Active Webserver: " + name
        } 
      };
}

