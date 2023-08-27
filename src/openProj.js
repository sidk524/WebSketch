
var projects = [];
var getServer = new XMLHttpRequest()
getServer.open("GET", "http://localhost:3002/getprojects", true)
  
getServer.send()
getServer.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
  
    projects = JSON.parse(this.responseText)
    var buttons = document.getElementsByClassName("list-group-item-action")
    if (projects.length == 0){
      buttons[0].classList.remove("hide")
      buttons[0].innerHTML = "No projects found - go create one!"
      // make this a link to the create project page 
      buttons[0].setAttribute('onclick','window.location.href = "newproj.html"')
    } else{
      for (i = 0; i<projects.length; i++){
        buttons[i].classList.remove("hide")
        buttons[i].innerHTML = projects[i]
    } buttons[i+1].classList.remove("hide")
    buttons[i+1].innerHTML = "Close active server"
    buttons[i+1].setAttribute('onclick','closeProj()')
    }
}
}

function closeProj(){
  if (document.getElementById("activeproj").innerHTML.includes("Active Webserver")){
    getServer.open("GET", "http://localhost:3002/closeserver", true)

    getServer.send()
    getServer.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var active = this.responseText;
          alert("Closed server "+ active)
          document.getElementById("activeproj").innerHTML = "No active webserver"
          
  }
  }
}else{
  alert("No server is currently active.")
}
}


function manageProject(name){
  if (document.getElementById("activeproj").innerHTML.includes("Active Webserver")){
    alert("Please close the active server before managing another project.")
  } else{
    window.location.href = "manageProject.html?name=" + name
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
          document.getElementById("activeproj").innerHTML = "Active Webserver: " + name + "<br>Running on internal port: "+ this.responseText + "<br>Running on external port: 80"
        } 
      };
}


