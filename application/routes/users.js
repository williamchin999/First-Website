var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  
  //if browser supports will send a json obj
  //useful for react because react app cant understand res.render
  res.json({message:'respond with a resource'});
});

//wont collide with other /logins cause in diff routing files
//localhost:3000/users.login to get into this router file
router.post('/login', (req,res,next) => {
  console.log(req.body);
  //console.log(req.body.message);
  res.send(req.body);
})
module.exports = router;
