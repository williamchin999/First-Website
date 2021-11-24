var express = require('express');
var router = express.Router();
var db = require('../config/database');
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

  //for testing
  // res.json ( {
  //   message: "Valid user!!!"
  // });

  //end of server side validation

    //does username/email exist
    db.execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results, fields])=>{
      
      if(results && results.length == 0) {
        return db.execute("SELECT * FROM users WHERE email=?", [email]);
      }
      else {
        throw new UserError(
          "Registration Failed: Username already exists",
          "/register",
          200
        );
      }
    })

    //encrypt password
    .then (([results,fields])=> {
      if(results && results.length == 0) {
        //2^15 rounds of iteration before hashing password
        return bcrypt.hash(password,15);
      }
      else {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/register",
          200
        );
      }
    })

    //add encrypted pass to database
    .then((hasedPassword)=>{
        let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?, now());";
        return db.execute(baseSQL, [username, email, hasedPassword])
    })

    //check if user is created, then redirect to login
    .then(([results,fields]) => {
      if (results && results.affectedRows) {
        successPrint("User.js --> User was created!!");
        req.flash('success','User Account Has Been Made!');
        res.redirect('/login');
      }
      else {
        throw new UserError( 
          "Server Error, user could not be created",
          "/register",
          500
        )
      }
    })
    .catch((err)=> {
      errorPrint("user could not be made",err);
      if(err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      }
      else {
        next(err);
      }
    })

  //end if ekse
})

//wont collide with other /logins cause in diff routing files
//localhost:3000/users.login to get into this router file
router.post('/login',loginValidator, (req,res,next) => {
  let username = req.body.username;
  let password = req.body.password;
  //res.json(req.body);
  /**
   * do server side validation
   * not done in vid
   */
   let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
   let userId;
  
   //does username/email exist
   db.execute(baseSQL, [username])
   .then(([results, fields])=>{
     //console.log(results);
     //console.log(results.length);
     if(results && results.length == 1) {
      let hashedPassword = results[0].password;
      userId = results[0].id;
      return bcrypt.compare(password,hashedPassword);
     }
     else {
       throw new UserError("invalid username and/or password","/login",200);
     }
   })

   //check if passwords match
   .then((passwordsMatched) => {
     if(passwordsMatched) {
      successPrint(`User ${username} is logged in`);
      req.session.username = username;
      req.session.userId= userId;
      res.locals.logged = true;
      req.flash('success','You have been successfully Logged in!');
      req.session.save( err => {
        res.redirect('/');
      })
     }
     else {
      throw new UserError("Invalid username and/or password","/login",200);
     }
   })

   //catch any errors
   .catch((err)=> {
    errorPrint("user login failed");
    if(err instanceof UserError) {
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
