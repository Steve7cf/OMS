require('dotenv').config()
const express = require("express")
const app = express()
const cookie = require('cookie-parser')
const cors = require('cors')
const session = require('express-session')
const mongodbSession = require('connect-mongodb-session')(session)
const path = require('path')
const logger = require('morgan')
const flash = require('connect-flash')


// session
const store = new mongodbSession({
    collection:"Sessions",
    uri:'mongodb://localhost:27017/test'
})

 // middlewares
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(cookie())
app.use(cors())
app.use(logger('dev'))
app.use(session({
    secret:'mysecret',
    saveUninitialized:false,
    resave:true,
    cookie:{
        maxAge:60 * 1000 * 15,
        httpOnly:true,
        sameSite:true,
        secure:false
    },
    store:store
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))
app.use(flash())

// routes
const routes = require('./routes/routes')
app.use('/', routes)

// exporting app to bin
module.exports = app

