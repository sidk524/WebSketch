

const express = require("express")
const app = express()
const port = 50000
const websitePath = "C:/Users/great/OneDrive/Documents/Example websites/Tech Website"
app.get('/', (req,res) => {
res.sendFile(websitePath +'/index.html')  
  })



app.listen(port, function(err){
  if (err) console.log(err)
  console.log("server listening on port 50000" )
})

app.use(express.static(websitePath))


