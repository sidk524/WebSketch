var getServer = new XMLHttpRequest()
getServer.open("GET", "http://localhost:3002/checkactiveserver", true)

getServer.send()
getServer.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var active = JSON.parse(this.responseText)
        
        if (active.port == "0"){
            document.getElementById("activeproj").innerHTML = "No active webserver"
            
        } else{
            document.getElementById("activeproj").innerHTML = "Active Webserver: " + active.project +"<br>" + "Running on external port: " + active.port + "<br>" + "Running on internal port: 80"
        }
    }
}



