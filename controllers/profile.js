var express = require('express');
var ObjectId = require('mongodb').ObjectID;
const multer = require('multer');
var User = require("models/user.js");
var Moment = require("models/moment.js");

var router = express.Router();

var upload = multer({
  dest: './uploads/user/profile'
});

//================================== MIDDLEWARES ===============================
const ensureAuth = require('middlewares/auth.js');

//================================== HELPERS ===============================
const populate = require('helpers/populate.js');

//================================== CONFIG ===============================
const update = require('config/updatepicture.js');

/*
 * GET momentlist
 */
router.get('/:user_id/momentlist', ensureAuth, (req, res) => {
  populate.populate({"user":ObjectId(req.params.user_id)}).exec(function(err, docs) {
    Moment.populate(docs, {
      path: 'feedback.user',
      model: 'User'
    },
    function(err, moments){
        res.end(JSON.stringify(moments));
    });
  });
});

router.get('/:user_id', ensureAuth, (req, res) => {
  User.findById(req.params.user_id, function(err, user){
      res.render('profile', {user: user.username, image: user.image});
  });
});

router.get('/', ensureAuth, (req, res) => {
    res.redirect('/profile/' + req.user.id);
});

router.post('/', ensureAuth, upload.single('fileName'), function(req, res) {
  update.setPicture(req);
  res.redirect('/profile');
});

module.exports = router;
