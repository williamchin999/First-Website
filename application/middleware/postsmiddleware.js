const {getNRecentPosts, getPostById} = require('../models/Posts');
const {getCommentsForPost} = require('../models/comments');
const postMiddleware = {}


//grabs top 8 rows, sort by created, then set results arry from db.execute, then store on res.locals
//makes it available to templates e.g. card template
postMiddleware.getRecentPosts = async function(req,res,next) {
    try {
        //await = eventual completion of async path
        let results = await getNRecentPosts(8);
        //expose what ever is returned to our template
        res.locals.results = results;
        if(results.length == 0) {
            req.flash('error','There are no post created yet');
        } 
        next();
    } catch (err) {
        next(err);
    }
}

postMiddleware.getPostById = async function(req,res,next) {
    try {
        let postId = req.params.id;
        let results = await getPostById(postId);
        if(results && results.length) {
            res.locals.currentPost = results[0];
            //must call next or will hang
            next();
        }
        else {
            req.flash("error", "This is not the post are looking for");
            res.redirect('/');
        }
    } catch (error) {
        next(err);
    }
}

postMiddleware.getCommentsByPostId = async function(req,res,next) {
    let postId = req.params.id;
    try {
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    } catch (error) {
        next(error);
    }
}
module.exports = postMiddleware;