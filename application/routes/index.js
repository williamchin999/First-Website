var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const {getRecentPosts, getPostById,getCommentsByPostId} = require('../middleware/postsmiddleware');
var db = require('../config/database');

/* GET home page. */
//when accessing home page, getRecentPost gets called first
router.get('/', getRecentPosts, function(req, res, next) {
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
//get index page
router.get('/index', (req,res,next) => {
  console.log('index route');
  res.render('index');
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


//check if user is logged in before posting img
router.use('/postimage', isLoggedIn);

//same thing
//router.get('/postimage', isLoggedIn, (req,res,next)

//postimage page
router.get('/postimage', (req,res,next) => {
  res.render('postimage',{title:"Post an Image"});
});

//viewpost page
//can accept anything not just a number after a slash (/)
//so add \\d+ for one or more digits
router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req,res,next) => {
  
  res.render("imagepost", {title:`Post ${req.params.id}` });
});

module.exports = router;
