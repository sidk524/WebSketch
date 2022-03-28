
const express = require("express")
const app = express()

app.get('/', (req,res) => {
res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/index.html')  
  })
  
app.listen(3001, function(err){
  if (err) console.log(err)
  console.log("server listening on port 3001" )
})


    app.get('/index', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/index.html')
  })

    app.get('/index.html', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/index.html')
  })

    
    
    app.get('/example.png', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/example.png')
  })
  
    
    app.get('/example1.png', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/example1.png')
  })
  
    
    app.get('/example2.png', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/example2.png')
  })
  
    
    app.get('/js/script.js', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/js/script.js')
  })
  
    
    app.get('/css/image.jpg', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/css/image.jpg')
  })
  
    
    app.get('/css/style.css', (req,res) => {
    res.sendFile('C:/Users/great/OneDrive/Desktop/Example websites/Example Website' +'/css/style.css')
  })
  