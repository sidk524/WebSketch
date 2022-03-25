
const express = require("express")
const app = express()

app.get('/', (req,res) => {
res.sendFile('C:/Users/skambli1/OneDrive - The Perse School/Documents/Website' +'/index.html')  
  })
  
app.listen(3001, function(err){
  if (err) console.log(err)
  console.log("server listening on port 3001" )
})


    app.get('/index', (req,res) => {
    res.sendFile('C:/Users/skambli1/OneDrive - The Perse School/Documents/Website' +'/index.html')
  })

    app.get('/index.html', (req,res) => {
    res.sendFile('C:/Users/skambli1/OneDrive - The Perse School/Documents/Website' +'/index.html')
  })

    