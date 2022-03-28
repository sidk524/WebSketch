var getServer = new XMLHttpRequest()
getServer.open("GET", "http://localhost:3002/checkactiveserver", true)

getServer.send()
getServer.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

        var active = this.responseText;
        
        if (active == "\"\""){
            document.getElementById("activeproj").innerHTML = "No active webserver"
            
        } else{
            document.getElementById("activeproj").innerHTML = "Active Webserver: " + active.slice(1, active.length-1)
        }

    }
}

