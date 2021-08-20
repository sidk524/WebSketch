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


function addCoreCode(websitePath, port){
  const coreData = 

`
const express = require("express")
const app = express()

app.get('/', (req,res) => {
  res.sendFile('index.html')})
  
app.listen(${port})
`
return coreData
}

function createNewServe(site, typeFile, websitePath){
  if (typeFile == "PHP"){
    const newServe = 
    `

    app.get('/${site.slice(0, -4)}', (req,res) => {
    res.sendFile('${websitePath}' +'${site}')
  })

    app.get('/${site}', (req,res) => {
    res.sendFile('${websitePath}' +'${site}')
  })

    `
  } else{
     const newServe = 
    `

    app.get('/${site.slice(0, -5)}', (req,res) => {
    res.sendFile('${websitePath}' +'${site}')
  })

    app.get('/${site}', (req,res) => {
    res.sendFile('${websitePath}' +'${site}')
  })

    `
    return newServe
  }
}


// Arrays to store pages that can be served
var htmlFiles = []
var phpFiles = []

// Current directory of the file


function createServer(projectName, database, port, htmlOrPhP, websitePath){
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

    // Reading all html and php pages in the directory
    dir.files(websitePath, function(err, files) { 
      
      // checks the file extension to determine the file type (html/php) and adds it to an array of files with that file type
      files.forEach(file =>{

          var file = String(file).slice(currD.length + 1) // removes the working path from the full path
          
          if (/html$/.test(file)) {
              htmlFiles.push(file)

            } else if (/php$/.test(file)) {
              phpFiles.push(file)
            }


      })

      htmlFiles.forEach(htmlf =>{
      console.log("here")
      fs.appendFile("projects/"+projectName+ "/" + projectName + ".js", createNewServe(htmlf, "html", websitePath), (err, fd) =>{
        if (err){
          console.log(err)
        }else{
          console.log("added html serve")
        }
      })
    });
            
    });



}

createServer("server", true, 3000, true,"C:/Users/great/Documents/Important Stuff/flash_games")
// Read the Options ticked and variables from the html
// Create a new js file in projects folder and name it with the project name
// Write core server code with expressjs and filesystem in node
// 

