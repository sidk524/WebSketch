const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

 
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// Initialise Node libraries
const express = require("express")
const fs = require("fs")
const dir = require("node-dir")



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

// Arrays to store pages that can be served
var htmlFiles = []
var phpFiles = []
var jsFiles = []
var cssFiles = []
var mediaFiles = []
var options;

const { install } = require('lmify')
const { setRootDir } = require('lmify')


// Main function
// C:/Users/great/OneDrive/Documents/Important Stuff/Website/Example Website

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

    
    fs.writeFile("projects/"+projectName+"/" +"package.json", createPackageJson(projectName), (err,fd) =>{
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

const serverApp = express()
const bodyParser = require("body-parser");

serverApp.use(bodyParser.urlencoded({ extended: false }));
serverApp.use(bodyParser.json());


serverApp.post('/createserver', (req,res) => {
    createServer(req.body.name, true, 3001, true, req.body.path)
    res.send("Good")
})
  
serverApp.get("/", (req,res)=>{
  console.log("here")
})

serverApp.listen(3002, function(err){
  if (err) console.log(err)
  console.log("server listening on port 3002" )
})