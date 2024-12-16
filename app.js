require("dotenv").config();
const express = require("express");
const app = express();
const cookie = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);
const path = require("path");
const logger = require("morgan");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const helmet = require('helmet')

// session
const store = new mongodbSession({
  collection: "Sessions",
  uri: process.env.DATABASE_URL,
});

// middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
app.use(cors());
app.use(logger("dev"));
app.use(
  session({
    secret: "mysecret",
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 60 * 1000 * 15,
      httpOnly: true,
      sameSite: true,
      secure: false,
    },
    store: store,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(flash());
app.use(helmet())

// routes
const routes = require("./routes/routes");
app.use("/", routes);

// exporting app to bin
try {
  mongoose.connect(process.env.DATABASE_URL);
  const db = mongoose.connection;
  db.on("error", (err) => {
    throw new Error(err.message);
  });
  db.once('open', () => {
    app.listen(process.env.PORT || 3000,() => {
        console.log(`server is up and running..`)
    })
    
  })
} catch (err) {
    console.log(err.message)
}

// error handling
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).render("errorPage", {error:err, status:statusCode});
  
}


app.use(errorHandler);
