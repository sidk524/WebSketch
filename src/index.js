// INITIALISE NODE LIBRARIES
const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require("express")
const fs = require("fs")
const dir = require("node-dir")
const { install } = require('lmify')
const { setRootDir } = require('lmify')
const bodyParser = require("body-parser");
const cp = require("child_process");
const { stderr } = require('process');
var rimraf = require("rimraf");
const { json } = require('express/lib/response');


// GLOBAL CONSTANTS

const serverApp = express()

//INITIALISE GLOBAL VARIABLES
var activeProject = "";
var htmlFiles = []
var phpFiles = []
var jsFiles = []
var cssFiles = []
var mediaFiles = []
var options;
var projectSTD = cp.spawn("node",["nothing.js"])
var projectSTD2 = cp.spawn("node",["nothing.js"])
var openPort
var stdout
var file
var projs
var fileNames
var activePort = 0
var projectsToPorts = {}


//DRIVER CODE
if (require('electron-squirrel-startup')) { 
  app.quit();
}

const createWindow = () => {
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};


app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



// core express code
function addCoreCode(websitePath, port){
  const coreData = 

`

const express = require("express")
const app = express()

app.get('/', (req,res) => {
res.sendFile('${websitePath}' +'/index.html')  
  })



app.listen(${port}, function(err){
  if (err) console.log(err)
  console.log("server listening on port ${port}" )
})

app.use(express.static('${websitePath}'))


`

return coreData
}
// server Package Json code
function createPackageJson (projectName) {
  let packageJ = `
  {
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "",
  "main": "${projectName}.js",
  "scripts": {
    "test": "${projectName}", 
    "start": "node ${projectName}.js" 
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "npm": "^7.21.0"
  }
}
`
return packageJ
}

function createProxy (port){
  const proxy = `
  const http = require('http');
  const httpProxy = require('http-proxy');

  // Create a proxy server
  const proxy = httpProxy.createProxyServer({});

  // Listen for incoming traffic on the specified port
  const port = 80; // replace with the desired port
  http.createServer((req, res) => {
    proxy.web(req, res, { target: 'http://localhost:${port}' });
  }).listen(port);
  `
  return proxy
}



var httpProxy = require('http-proxy');

// Main function

function createServer(projectName, database, port, htmlOrPhP, websitePath){
    const projectD = process.cwd() + "\\projects\\"+projectName

    projectsToPorts[projectName] = port

    //Creating initial file

    fs.mkdir("./projects/" + projectName, function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("New directory successfully created.")
    }
    })

    const currD = websitePath
    fs.writeFile("projects/"+projectName+"/" + projectName + ".js", addCoreCode(websitePath, port), (err,fd) =>{
      if (err){
        console.log(err)
      }else{
        console.log("added core data")
      }
    })
    
    fs.writeFile("projects/"+projectName+"/" +"package.json", createPackageJson(projectName), (err,fd) =>{
      if (err){
        console.log(err)
      }else{
        console.log("Package.json")
      }
    })

    
      setRootDir(projectD)
      install('express')
    
    // make the proxy server

    fs.writeFile("projects/"+projectName+"/" + projectName + "Proxy.js", createProxy(port), (err,fd) =>{
      if (err){
        console.log(err)
      }else{
        console.log("added proxy data")
      }
    })
}




// Inner server to communicate with the frontend

serverApp.use(bodyParser.urlencoded({ extended: false }));
serverApp.use(bodyParser.json());


serverApp.post('/createserver', (req,res) => {
    createServer(req.body.name, true, req.body.port, true, req.body.path)
    res.send("Good")
})


serverApp.get("/", (req,res)=>{
  console.log("here")
})


serverApp.get("/getprojects", (req,res)=>{
  fileNames = fs.readdirSync(process.cwd()+"/projects");
  res.send(JSON.stringify(fileNames))
})



serverApp.post('/openproject', (req,res) => {

  projectSTD.kill('SIGTERM');
  projectSTD2.kill('SIGTERM');
  var projName = req.body.name
  activeProject = projName
  console.log("node "+projName + ".js")
  const exec_options = {
    cwd: process.cwd() + "\\projects\\" + projName,
    env:null,
    encoding: "utf8",
    timeout:0,
    maxBuffer: 200*1024,
    killSignal: "SIGTERM"
  }
  projectSTD = cp.spawn("node", [projName + ".js"], exec_options)
  projectSTD.stdout.on("data", stdout =>{
    stdout = stdout.toString().split("port ")
    port = stdout[1]
    activePort = port
    res.send(port)
    console.log(stdout)
  })
  // run the proxy file thats in the same directory
  console.log("node "+projName + "Proxy.js")
  const exec_options2 = {
    cwd: process.cwd() + "\\projects\\" + projName,
    env:null,
    encoding: "utf8",
    timeout:0,
    maxBuffer: 200*1024,
    killSignal: "SIGTERM"
  }
  projectSTD2 = cp.spawn("node", [projName + "Proxy.js"], exec_options2)
  projectSTD2.stdout.on("data", stdout =>{
    console.log(stdout)

  })
  
})


serverApp.get("/checkactiveserver", (req,res) => {
  var obj = {"port": activePort, "project": activeProject}
  res.send(JSON.stringify(obj))
})


serverApp.post('/getport', (req,res) => {
  console.log(req)

})


serverApp.post("/delproject", (req,res) => {
  projectSTD.kill('SIGTERM');
  projectSTD2.kill('SIGTERM');

  activeProject = "";
  activePort = 0
  var portToClose = projectsToPorts[req.body.name]


  console.log(process.cwd() + "\\projects\\"+req.body.name)
  rimraf(process.cwd() + "\\projects\\"+req.body.name, function (err) {
    if (err){
      console.log(err)
      res.send("Sorry, there was an error deleting that project. Please close any active servers and try again.")
    } else{
      res.send("Project deleted successfully")
    }
  })
})


serverApp.get("/closeserver", (req,res) => {
  projectSTD.kill('SIGTERM');
  projectSTD2.kill('SIGTERM');
  res.send(activeProject)
  activeProject = "";
  activePort = 0
})


serverApp.listen(3002, function(err){
  if (err) console.log(err)
  console.log("server listening on port 3002" )
})

// handle /checkwebsitepath post request and send back whether the path is valid or not
serverApp.post("/checkwebsitepath", (req,res) => {
  var path = req.body.websitePath
  var exists = fs.existsSync(path)
  // check whether the path has html files in it
  if (exists) {
    var files = fs.readdirSync(path)
    htmlFiles = []
    files.forEach(file =>{
      lowerFile = file.toLowerCase() 
      console.log(htmlFiles)
      // check if the file name ends in .html
      if (lowerFile.endsWith(".html")) {
        htmlFiles.push(file)
      }
    })
    if (htmlFiles.length > 0) {
        res.send(JSON.stringify("true"))
    } else {
      console.log("no html files")
      res.send(JSON.stringify("false"))
      }
    } else {
      console.log("path does not exist")
      res.send(JSON.stringify("false"))
    }})

