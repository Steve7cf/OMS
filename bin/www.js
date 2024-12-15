const app = require("../app")
const http = require('http')
const mongodb = require('mongoose')

const server = http.createServer(app)

function callBack(){
    mongodb.connect('mongodb://localhost:27017/test')
    const db = mongodb.connection
    db.on('error', (err) => {console.log(err.message)})
    db.once('open', () => {console.log(`http://localhost:${process.env.PORT}`)})
}

server.listen(process.env.PORT || 5000, callBack)