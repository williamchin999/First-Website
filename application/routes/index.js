var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"William Chin" });
});

/*middle ware to redirect to dashboard first can be used to restrict access 
e.g user is not logged in then cant post*/
router.use('/login', (req,res,next) => {
  console.log('login mounted middelware');
  if(/*islogginedin*/ false) {
      res.render('dashboard');
  }
  else {
    next();
  }
})
//Get Login page
router.get('/login', (req,res,next) => {
  console.log('login route');
  res.render('login');
})

//register page
router.get('/register', (req,res,next) => {
  res.render('registration');
})

//register page
router.get('/postimage', (req,res,next) => {
  res.render('postimage');
})

module.exports = router;
