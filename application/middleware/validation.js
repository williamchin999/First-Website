const checkUsername = (username) => {
    /**
     * Regex Explanation Can go to regex101 for more indepth
     * ^ -> start of string
     * \D ->anything not a digit [0-9]
     * \w anything that is a alphanumeric character [a-zA-Z0-9]
     * {2,} -> 2 or more characters w/ no upper limit
     */
    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);

}

const checkPassword = (password) => {
    /**
     * Regex
     * ?= captured match must be followed by whatever is within the parentheses
     * . matches any character (except for line terminators)
     * * matches the previous token between zero and unlimited times
     * (?=.*[A-Za-z]) -> matches string followed by any a-zA-Z character not including the a-zA-Z
     * (?=.*\d) -> matches A-Za-z followed by a digit not including the digit
     * [A-Za-z\d] -> matches A-Za-z followed by a digit
     * {8,} -> must be 8+ charaters w/ upper limit of 16 characters
     */
    let passwordChecker = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    return passwordChecker.test(password);
}

const checkEmail = (email) => {
    /**
     * pulled from online :3
     */
    let emailChecker =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailChecker.test(email);
}

const registerValidator = (req,res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if(!checkUsername(username)) {
        req.flash('error',"Please begin with a letter & Enter 2 or more characters ");
        req.session.save( err => {
            res.redirect("/register");
          })
    }
    else if (!checkPassword(password)){
        req.flash('error',"Minimum 4 characters & At least 1 letter and number");
        req.session.save( err => {
            res.redirect("/register");
          })
    }
    else if (!checkEmail(email)){
        req.flash('error',"Invalid Email");
        req.session.save( err => {
            res.redirect("/register");
          })
    }
    else {
        next();
    }
}

const loginValidator = (req,res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    if(!checkUsername(username)) {
        req.flash('error',"Please begin with a letter & Enter 2 or more characters ");
        req.session.save( err => {
            res.redirect("/login");
          })
    }
    else if (!checkPassword(password)){
        req.flash('error',"Minimum 4 characters & At least 1 letter and number");
        req.session.save( err => {
            res.redirect("/login");
          })
    }
    else {
        next();
    }
}

module.exports = {registerValidator, loginValidator}