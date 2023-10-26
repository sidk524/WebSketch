// ------------------
// INITIALISE NODE LIBRARIES
// ------------------
const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require("express");
const fs = require("fs");
const util = require('util');
const dir = require("node-dir");
const { install, setRootDir } = require('lmify');
const bodyParser = require("body-parser");
const cp = require("child_process");
const { stderr } = require('process');
const rimraf = require("rimraf");
const readline = require('readline');
const httpProxy = require('http-proxy');



// ------------------
// GLOBAL CONSTANTS AND VARIABLES
// ------------------

const serverApp = express();
const rimrafAsync = util.promisify(rimraf);
var activeProject = "";
var htmlFiles = [];
var phpFiles = [];
var jsFiles = [];
var cssFiles = [];
var mediaFiles = [];
var options;
var projectSTD = cp.spawn("node", ["nothing.js"]);
var projectSTD2 = cp.spawn("node", ["nothing.js"]);
var openPort;
var stdout;
var file;
var projs;
var fileNames;
var activePort = 0;
var projectsToPorts = {};


// ------------------
// ELECTRON SETUP AND WINDOW CREATION
// ------------------

// Check for Squirrel events (related to Electron installer)
if (require('electron-squirrel-startup')) { 
  app.quit();
}

// Create the main Electron window
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


// ------------------
// WEBSITE SERVER CREATION FUNCTIONS
// ------------------

// Return the core code for the express server
function addCoreCode(websitePath, port) {
  return `
    const express = require("express");
    const app = express();
    const port = ${port};
    const websitePath = "${websitePath}";
    app.get('/', (req,res) => {
      res.sendFile(websitePath +'/index.html');  
    });
    app.listen(port, function(err) {
      if (err) console.log(err);
      console.log("server listening on port ${port}");
    });
    app.use(express.static(websitePath));
  `;
}

// Return package.json content for the server
function createPackageJson(projectName) {
  return `
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
  `;
}

// Return proxy configuration
function createProxy(port) {
  return `
    const http = require('http');
    const httpProxy = require('http-proxy');
    const proxy = httpProxy.createProxyServer({});
    const port = ${port};
    http.createServer((req, res) => {
      proxy.web(req, res, { target: 'http://localhost:' + port });
    }).listen(80);
  `;
}

// Main function to set up and create the server
function createServer(projectName, database, port, htmlOrPhP, websitePath) {
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

    // make the config file, which will be used to store the port number and other data

    fs.writeFile("projects/"+projectName+"/" + "config.json", JSON.stringify({port: port, projectName: projectName, websitePath: websitePath}), (err,fd) =>{
      if (err){
        console.log(err)
      }else{
        console.log("added config data")
      }
    })

}

// ------------------
// INNER SERVER ENDPOINTS AND FUNCTIONALITIES
// ------------------

serverApp.use(bodyParser.urlencoded({ extended: false }));
serverApp.use(bodyParser.json());

serverApp.post('/createserver', (req, res) => {
  createServer(req.body.name, true, req.body.port, true, req.body.path)
  res.send("Good")
});


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

serverApp.get("/closeserver", (req,res) => {
  projectSTD.kill('SIGTERM');
  projectSTD2.kill('SIGTERM');
  res.send(activeProject)
  activeProject = "";
  activePort = 0
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



serverApp.post("/getconfigsettings", (req,res) => {
      var config = fs.readFileSync(process.cwd() + "\\projects\\" + req.body.name + "\\config.json", "utf8")
      res.send(config)
})

serverApp.post("/saveconfigsettings", (req,res) => {
  saveConfigSettings(req.body.oldName, req.body.configdata.projectName, req.body.configdata.port, req.body.configdata.websitePath)
  
})

serverApp.post("/delproject", async (req, res) => {
  var projectName = req.body.name;
  try {
      var result = await delProject(projectName);
      console.log(result);
      res.send(result);
  } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
  }
});


serverApp.listen(3002, function(err) {
  if (err) console.log(err);
  console.log("server listening on port 3002");
});

// ------------------
// UTILITY FUNCTIONS
// ------------------

async function delProject(projectName) {
  projectSTD.kill('SIGTERM');
  projectSTD2.kill('SIGTERM');
  activeProject = "";
  activePort = 0

  if (fs.existsSync(process.cwd() + "\\projects\\"+projectName)){
    try {
      await rimrafAsync(process.cwd() + "\\projects\\"+projectName)
      return "1"
    } catch (err) {
        console.log(err)
        return "3"
      } 
    } else {
    return "2"
  }
}

async function changePort(filename, newPort) {
  
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lines = [];
  
  for await (const line of rl) {
    console.log(line)
    if (line.includes('const port =')) {
      lines.push(`const port = ${newPort};`);
    } else {
      lines.push(line);
    }
  }
  
  fs.writeFileSync(filename, lines.join('\n'));
}

async function changeWebsitePath(serverFilePath, newPath) {
  const fileStream = fs.createReadStream(serverFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lines = [];

  for await (const line of rl) {
    console.log(line)
    if (line.includes('const websitePath =')) {
      lines.push(`const websitePath = "${newPath}";`);
    } else {
      lines.push(line);
    }
  }

  fs.writeFileSync(serverFilePath, lines.join('\n'));
}

function saveConfigSettings(oldname, projectName, port, websitePath) {
  try {
    if (oldname != projectName) {
      fs.renameSync(process.cwd() + "\\projects\\" + oldname, process.cwd() + "\\projects\\" + projectName)
      fs.renameSync(process.cwd() + "\\projects\\" + projectName + "\\" + oldname + ".js", process.cwd() + "\\projects\\" + projectName + "\\" + projectName + ".js")
      fs.renameSync(process.cwd() + "\\projects\\" + projectName + "\\" + oldname + "Proxy.js", process.cwd() + "\\projects\\" + projectName + "\\" + projectName + "Proxy.js")
    }}
    catch (err) {
      console.log(  err)
    } 
  var config = fs.readFileSync(process.cwd() + "\\projects\\" + projectName + "\\config.json")
  var configObj = JSON.parse(config)
  configObj.port = port
  configObj.websitePath = websitePath
  fs.writeFileSync(process.cwd() + "\\projects\\" + projectName + "\\config.json", JSON.stringify(configObj))

  changePort(process.cwd() + "\\projects\\" + projectName + "\\" + projectName + ".js", port)
  changePort(process.cwd() + "\\projects\\" + projectName + "\\" + projectName + "Proxy.js", port)
  
  changeWebsitePath(process.cwd() + "\\projects\\" + projectName + "\\" + projectName + ".js", websitePath)

}
