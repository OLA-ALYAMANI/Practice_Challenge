const express = require("express");
const server = express();
const session = require("express-session");
require("dotenv").config();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const authRoutes = require("./routes/auth.routes");
//
const flash = require("connect-flash"); // displays 1 time messages
let passport = require("./helper/ppConfig");
//


mongoose.connect(
  process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => {
    console.log("mongdb connected!");
  },
  err => {
    console.log(err);
  }
);

mongoose.set("debug", true);
server.use(express.static("public")); //tells express to look in public for static files
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(expressLayouts);


/*-- These must be place in the correct place */
server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
  })
);
//-- passport initialization
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

server.use(function(request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash();
  response.locals.currentUser = request.user;
  next();
});

server.listen(process.env.PORT, () =>
  console.log(`connected to express on ${PORT}`)
);




