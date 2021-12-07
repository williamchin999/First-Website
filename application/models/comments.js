var db = require('../config/database');
//create comment model obj
const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
    let baseSQL = `INSERT INTO comments (comment, fk_postId, fk_authorId) VALUES (?,?,?);`
    //db.execute caches sql statements
    //cause not really gonna insert same comment 
    return db.query(baseSQL, [comment,postId,userId])
    .then(([results,fields]) => {
        //if affectedrows = 0, nothing inserted
        if(results && results.affectedRows) {
            //gets id of row you inserted
            //only works if auto inc and primary key
            return Promise.resolve(results.insertId);
        }
        else {
            return Promise.resolve(-1);
        }
    })
    .catch ((err) => Promise.reject(err));
}

CommentModel.getCommentsForPost = (postId) => {
    let baseSQL = `SELECT u.username, c.comment, c.created, c.id
    FROM comments c
    JOIN users u
    on u.id=fk_authorId
    WHERE c.fk_postId =?
    ORDER BY c.created DESC`;
    return db.query(baseSQL,[postId])
    .then(([results,fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

module.exports = CommentModel;