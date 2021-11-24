const {successPrint,errorPrint} = require("../helpers/debug/debugprinters");

const routeProtectors = {};

//express- recieve-req -> mw1-> mw2 -> ... -> mwN -> router.HTTP
routeProtectors.userIsLoggedIn = function(req,res,next) {
    if(req.session.username) {
        successPrint('User is loggedin');
        next();
    }
    else {
        errorPrint('user is not loggedin!');
        req.flash ('error', 'You must be logged in to create a post!');
        req.session.save( err => {
            res.redirect('/login');
          })
    }
}

module.exports = routeProtectors;