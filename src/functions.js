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


function validatePort() {
  var portNum = document.getElementById("portNumID").value;
        var portError = document.getElementById("portError");

        if (portNum < 49152 || portNum > 65535) {
            portNumID.classList.add("is-invalid");
            portError.style.display = "block";
            return false;
        } else {
            portNumID.classList.remove("is-invalid");
            portError.style.display = "none";
            return true;
        }
}


function chainFunc(){
  event.preventDefault();
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
          websitePathID.classList.remove("is-invalid");
          pathError.style.display = "none";
          if(validatePort()) {
            inputs = document.getElementsByClassName("form-control")
            postServer = new XMLHttpRequest();
            postServer.open("POST", "http://localhost:3002/createserver", true);
            path = inputs[0].value.replace(/\\/g, "/")
            name = inputs[1].value
            port = inputs[2].value
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
              let focusedElement = document.activeElement;
              alert("Webserver Succesfully created")
              focusedElement.focus();
            } 
          };
      } 
        } else{
          websitePathID.classList.add("is-invalid");
          pathError.style.display = "block";
        }
      
      
    }
  }
  websitePathCheck.send(data)

}
var text;


var form = document.getElementById("projForm");
   form.addEventListener("submit", function(event) {
       var isValid = form.checkValidity();
       if (!isValid) {
           event.preventDefault();
           event.stopPropagation();
       }
       form.classList.add("was-validated");
   });


