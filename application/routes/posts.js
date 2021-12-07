var express = require('express');
var router = express.Router();
const {errorPrint,successPrint} = require("../helpers/debug/debugprinters");
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require('../models/Posts');
var PostError = require('../helpers/error/PostError');

const { basename } = require('path');
const e = require('express');
const { postValidator } = require('../middleware/validation');

//when multer uploads, will store in here then rename file
var storage = multer.diskStorage({
    destination: function(req,file,cb) {
        //no error
        cb(null, "public/images/uploads");
    },
    filename: function(req,file,cb) {
        //caterogy of file and type
        //takes 2nd item of split
        let fileExt = file.mimetype.split('/')[1];

        //convert bytes to hex
        let randomName = crypto.randomBytes(22).toString("hex");

        //let file be renamed
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});


router.post('/createPost', uploader.single("uploadImage"), postValidator, (req,res,next) => {
  //  console.log(req)
   // return
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;

    //need to get foriegn ref from user post in database
    let fk_userId = req.session.userId;

    /**
     * do server validation on own
     * make sure title and fk_key is not empty
     * if any values that used for insert statement
     * are undefined, mysql.query or execyte will fail 
     * with the following error:
     * BIND paramerters can't be undefined
     */
    
    //not pulling sharp since it will pull more than i need
    sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(()=> {
        return PostModel.create(
            title,
            description,
            fileUploaded,
            destinationOfThumbnail,
            fk_userId
        );
    })
    .then((postWasCreated) => {
        //check if value is anything other than 0 when inserting post
        if(postWasCreated) {
            req.flash('success',"Your post was created successfully!");
            req.session.save( err => {
                res.redirect('/');
            })
        } 
        else {
            throw new PostError('Post could not be created!!', 'postImage', 200);
        }
    })
    .catch((err) => {
        if(err instanceof PostError) {
            errorPrint(err.getMessage());
            req.flash('error',err.getMessage());
            res.status(err.getStatus());
            res.redirect(err.getRedirectURL());
        }
        else {
            next(err);
        }
    })
});

//localhost:3000/posts/search?search=value
router.get('/search', async (req,res,next) => {
    let searchTerm = req.query.search;
    try {
        if(!searchTerm) {
            res.send({
                resultsStatus:"info",
                message:"No search term given",
                results:[]
            });
        }
        else {
            let results = await PostModel.search(searchTerm);
            if (results.length) {
                res.send({
                    message: `${results.length} results found`,
                    results: results,
                });
            }
            else {
                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    message: "No result were found for your search but here are the 8 most recent posts",
                    results: results,
                })
            }
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;