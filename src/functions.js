var postServer
var inputs
var data
var path
var name
function chainFunc(){
  
  inputs = document.getElementsByClassName("form-control")
  postServer = new XMLHttpRequest();
  postServer.open("POST", "http://localhost:3002/createserver", true);
  
  path = inputs[0].value
  name = inputs[1].value

postServer.setRequestHeader("Accept", "application/json");
postServer.setRequestHeader("Content-Type", "application/json");
  data = `{
    "path": "${path}",
    "name": "${name}"
  }`
  console.log(data)
  postServer.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      alert("success")
    }
  };
  postServer.send(data)

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

setInterval(checkEmpty, 100)