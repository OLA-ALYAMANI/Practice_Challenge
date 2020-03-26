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
  check('firstName').isLength({ min: 3 }),
  check('lastName').isLength({ min: 3 }),
  check('phoneNumber').isLength({ min: 9 }),
  check('password').isLength({ min: 5 }),
  check('city').isLength({ min: 3 }),
  check('street').isLength({ min: 3 }),
  check('age').isLength({ min: 2 }),
  check('homeNumber').isLength({ min: 2 }),

], 
//first case: signing up with errors
(request, response) => {
  const errors = validationResult(request);
  console.log(errors);
  if (!errors.isEmpty()) {
    request.flash("autherror", errors.errors);
    return response.redirect("/auth/signup");
    }

  //second case: signing up with no errors
  let user = new User(request.body);
  user
    .save()
    .then(() => {
      //user login after registration
      //or response.redirect("/auth/signin")
      passport.authenticate("local", {
        successRedirect: "/home",
        successFlash: "Account created and You have logged In!"
      })(request, response);
    })
    .catch(err => {
      // console.log(err);
      if (err.code == 11000) {
        console.log("Email Exists");
        request.flash("error", "Email Exists");
        return response.redirect("/auth/signup");
      }
      response.send("error!!!");
    });
});

router.get("/auth/signin", (request, response) => {
  response.render("auth/signin");
});

router.get("/home", isLoggedIn, (request, response) => {
  // request.user
  User.find().then(users => {
    response.render("home", { users });
  });
});


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
