var express = require('express');
var router = express.Router();
var db = require('../config/database');
const UserModel = require('../models/Users');
const UserError = require('../helpers/error/UserError');
const {errorPrint,successPrint} = require("../helpers/debug/debugprinters");
var bcrypt = require('bcrypt');
const { registerValidator, loginValidator } = require('../middleware/validation');


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   //res.send('respond with a resource');
  
//   //if browser supports will send a json obj
//   //useful for react because react app cant understand res.render
//   res.json({message:'respond with a resource'});
// });

router.post('/register', registerValidator, (req,res,next) => {
  //console.log(req.body);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.Cpassword;

  //server side validation

  UserModel.usernameExists(username)
    .then((userDoesNameExist) => {
      if(userDoesNameExist) {
        throw new UserError(
          "Registration Failed: Username already exists",
          "/register",
          200
        );
      }
      else {
        return UserModel.emailExists(email);
      }
    })
    .then((emailDoesExist) => {
      if(emailDoesExist) {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/register",
          200
        );
      }
      else {
        return UserModel.create(username, password, email);
      }
    })
    .then((createdUserId) => {
      if(createdUserId <0) {
        throw new UserError( 
          "Server Error, user could not be created",
          "/register",
          500
        );
      }
      else {
        successPrint("User.js --> User was created!!");
        req.flash('success','User Account Has Been Made!');
        res.redirect('/login');
      }
    })
    .catch((err)=> {
      errorPrint("user could not be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      }
      else {
        next(err);
      }
    });
});

//wont collide with other /logins cause in diff routing files
//localhost:3000/users.login to get into this router file
router.post('/login',loginValidator, (req,res,next) => {
  let username = req.body.username;
  let password = req.body.password;
   //does username/email exist
  
  UserModel.authenticate(username, password)
    //check if passwords match
    .then((loggedUserId) => {
      console.log(loggedUserId);
      if (loggedUserId > 0) {
        successPrint(`User ${username} is logged in`);
        req.session.username = username;
        req.session.userId = loggedUserId;
        res.locals.logged = true;
        req.flash('success', 'You have been successfully Logged in!');
        req.session.save(err => {
          res.redirect('/');
        })
      }
      else {
        throw new UserError("Invalid username and/or password", "/login", 200);
      }
    })
    //catch any errors
    .catch((err) => {
      errorPrint("user login failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect('/login');
      }
      else {
        next(err);
      }
    });
});

//Logout
//use post because modifying a resource on server
//wrapped around database
router.post('/logout', (req,res,next) => {
  //is a fetch call from the front end
  console.log("In logout");
  req.session.destroy((err) => {
    if (err) {
      errorPrint('session could not be destroyed.');
      next(err);
    }
    else {
      successPrint('Session was destroyed');
      res.clearCookie('csid');
      res.json({status: 'OK', messaage: "user is logged out"});
    }
  })

});


module.exports = router;
