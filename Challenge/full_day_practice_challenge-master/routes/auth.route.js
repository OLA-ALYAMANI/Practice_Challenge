const router = require("express").Router();
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const User = require("../models/user.model");
const { check, validationResult } = require("express-validator");


router.get("/auth/signup", (request, response) => {
  response.render("auth/signup");
});

//error decleration
router.post("/auth/signup", [
  check('firstName').isLength({ min: 2 }),
  check('lastName').isLength({ min: 2 }),
  check('phoneNumber').isLength({ min: 9 }),
  check('password').isLength({ min: 5 }),
  check('city').isLength({ min: 3 }),
  check('street').isLength({ min: 5 }),
  check('age').isLength({ min: 2 }),
], 


//--- Login Route 
router.post(
  "/auth/signin",
  passport.authenticate("local", {
    successRedirect: "/home", //after login success
    failureRedirect: "/auth/signin", //if fail
    failureFlash: "Invalid Username or Password",
    successFlash: "You have logged In!"
  })
);

//--- Logout Route
router.get("/auth/logout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "Dont leave please come back!");
  response.redirect("/auth/signin");
});

module.exports = router;
