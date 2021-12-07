var db = require('../config/database');
var bcrypt = require('bcrypt');
const UserModel = {};

UserModel.create = (username, password, email) => {
   return bcrypt.hash(password,15)
   .then((hashedPassword) => {
    let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?, now());";
    return db.execute(baseSQL, [username, email, hashedPassword])
   })
   .then(([results,fields]) => {
       if(results && results.affectedRows) {
        //only works for auto increment column id
        return Promise.resolve(results.insertId);
       }
       else{
        return Promise.resolve(-1);
       }
   })
   .catch((err) => Promise.reject(err));
}

UserModel.usernameExists = (username) => {
    //need to return here else eveyrthing will be Undefined
    return db.execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results,fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    //=> returns Promise err
    .catch((err) => Promise.reject(err));
}

UserModel.emailExists = (email) => {
    //need to return here else eveyrthing will be Undefined
    return db.execute("SELECT * FROM users WHERE email=?", [email])
    .then(([results,fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    //=> returns Promise err
    .catch((err) => Promise.reject(err));
}

UserModel.authenticate = (username, password) => {
    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
    let userId;

    //need to return db else it doesnt return for the authenticate func
    return db.execute(baseSQL, [username])
    .then(([results,fields]) => {
        if(results && results.length == 1) {
            userId = results[0].id;
            return bcrypt.compare(password, results[0].password);
        }
        else {
            //only for auto increment column ids
            return Promise.reject(-1);
        }
    })
    .then((passwordsMatched) => {
        if(passwordsMatched) {
            //need to return else userId is set to Undefined
            return Promise.resolve(userId);
        }
        else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) =>Promise.reject (err));
};

module.exports = UserModel;