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
var openPort
var stdout
var file
var projs
var fileNames
var activePort = 0


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

function createNewServe(__site, typeFile, __websitePath){
  if (typeFile == "php"){
    const newServe = 
    `
    app.get('/${__site.slice(0, -4)}', (req,res) => {
    res.sendFile('${__websitePath}' +'/${__site}')
  })
    app.get('/${__site}', (req,res) => {
    res.sendFile('${__websitePath}' +'/${__site}')
  })
    `
    return newServe
  } 

  else if(typeFile == "html"){
     const newServe = 
    `
    app.get('/${__site.slice(0, -5)}', (req,res) => {
    res.sendFile('${__websitePath}' +'/${__site}')
  })

    app.get('/${__site}', (req,res) => {
    res.sendFile('${__websitePath}' +'/${__site}')
  })

    `
    return newServe
  } else{
    const newServe = 
    `
    
    app.get('/${__site}', (req,res) => {
    res.sendFile('${__websitePath}' +'/${__site}')
  })
  `
  
  
  return newServe
  }
  
}

var httpProxy = require('http-proxy');

// Main function

function createServer(projectName, database, port, htmlOrPhP, websitePath){
    const projectD = process.cwd() + "\\projects\\"+projectName
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
    
    fs.writeFile("projects/"+projectName+"/" +"yeah bro package.json", createPackageJson(projectName), (err,fd) =>{
      if (err){
        console.log(err)
      }else{
        console.log("Package.json")
      }
    })
    // Going through each file
    dir.files(websitePath, function(err, files) { 
      
      // checks the file extension to determine the file type and adds it to an array of files with that file type
      files.forEach(file =>{

          var file = String(file).slice(currD.length + 1) // removes the working path from the full path
          file = file.replace(/\\/g, "/") // replaces backslash
          lowerFile = file.toLowerCase() // makes extensions lowercase for COMPARISON ONLY

          if (/html$/.test(lowerFile)) {
              htmlFiles.push(file)
            } else if (/php$/.test(lowerFile)) {
              phpFiles.push(file)
            } else if (/css$/.test(lowerFile)) {
              cssFiles.push(file)
            } else if (/js$/.test(lowerFile)) {
              jsFiles.push(file)
            } else {
              mediaFiles.push(file)
            }
    
      })
    
      function appendingFiles(array, fileType) {
        array.forEach(file =>{
          fs.appendFile("projects/"+projectName+ "/" + projectName + ".js", createNewServe(file, fileType, websitePath), (err, fd) =>{
            if (err){
              console.log(err)
            } 
          })

        });
      }


      var fileTypes = ["html", "php", "media", "js", "css"]
      var arrays = [htmlFiles, phpFiles, mediaFiles, jsFiles, cssFiles]
      for (var i = 0; i < fileTypes.length; i ++) {
        appendingFiles(arrays[i], fileTypes[i])
      }

      setRootDir(projectD)
      install('express')
    });
    
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
  activeProject = "";
  activePort = 0
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

