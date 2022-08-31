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
        buttons[i].innerHTML = "Delete: " + projects[i]
    }
}
}


var openProjectRequest
function delProject(name, id){
    name = name.replace("Delete: ", "")
    openProjectRequest = new XMLHttpRequest()
    openProjectRequest.open("POST", "http://localhost:3002/delproject", true)
    openProjectRequest.setRequestHeader("Accept", "application/json");
    openProjectRequest.setRequestHeader("Content-Type", "application/json");
    var data = `{"name": "${name}"}`
    if ( document.getElementById("activeproj").innerHTML.split(" ").includes(name)){
      document.getElementById("activeproj").innerHTML = "No active webserver"
    }
    openProjectRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 ) {
          var res = this.responseText
          alert(res)
          document.getElementById("activeproj").innerHTML = "No active webserver"
          document.getElementById(toString(id)).classList.add("hide")
        } 
      };
      openProjectRequest.send(data)

}

