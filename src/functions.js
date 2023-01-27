var postServer
var inputs
var data
var path
var name
var getServer
var port
var websitePath


function checkWebsitePath(){
  var websitePath = document.getElementsByClassName("form-control")[0].value.replace(/\\/g, "/")
  var websitePathCheck = new XMLHttpRequest()
  websitePathCheck.open("POST", "http://localhost:3002/checkwebsitepath", True)
  websitePathCheck.setRequestHeader("Accept", "application/json");
  websitePathCheck.setRequestHeader("Content-Type", "application/json");
  data = `{"websitePath": "${websitePath}"}`
  websitePathCheck.send(data)
  websitePathCheck.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = this.responseText
      
      if (response == "true"){
        return true
      } else{
        return false
      }
    }
  }
}


function chainFunc(){
  var websitePath = document.getElementsByClassName("form-control")[0].value.replace(/\\/g, "/")
  var websitePathCheck = new XMLHttpRequest()
  websitePathCheck.open("POST", "http://localhost:3002/checkwebsitepath", false)
  websitePathCheck.setRequestHeader("Accept", "application/json");
  websitePathCheck.setRequestHeader("Content-Type", "application/json");
  data = `{"websitePath": "${websitePath}"}`
  websitePathCheck.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText)
      if (response == "true"){
        inputs = document.getElementsByClassName("form-control")
        postServer = new XMLHttpRequest();
        postServer.open("POST", "http://localhost:3002/createserver", true);
        path = inputs[0].value.replace(/\\/g, "/")
        name = inputs[1].value
        port = document.getElementById("portNum").value
        postServer.setRequestHeader("Accept", "application/json");
        postServer.setRequestHeader("Content-Type", "application/json");
        data = `{
          "path": "${path}",
          "name": "${name}",
          "port":"${port}"
        }`
      postServer.send(data)
      postServer.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          alert("Webserver Succesfully created")
        } 
      };
      } else{
        alert("Invalid website path")
      }
    }
  }
  websitePathCheck.send(data)

}
var text;
function checkEmpty(){
  text = document.getElementsByClassName("form-control")[0].value
  text1 = document.getElementsByClassName("form-control")[1].value
  
  if (text == "" || text1 == ""){
    document.getElementById("submitbutton").disabled = true;

  } else{
    document.getElementById("submitbutton").disabled = false;
  }
}



// function displayPortNum(){
 

//   var portInput = document.getElementsByClassName("form-range")[0].value
//   var displayPort = document.getElementsByClassName("form-label")[0]
//   displayPort.innerHTML = `Port Number: ${portInput}`
 

// }



//setInterval(displayPortNum, 10)
setInterval(checkEmpty, 100)
