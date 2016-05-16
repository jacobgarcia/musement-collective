var Moment = require("models/moment.js");
var ObjectId = require('mongodb').ObjectID;

var feedMoment = function(req){
  console.log("The ID: " + req.params.id + " The comment: " + req.body.comment);
  var condition = {"_id":ObjectId(req.params.id)}, update = {$push: {feedback:{user: req.user.id, comment: req.body.comment}}}, options = {multi: true};
  Moment.update(condition, update, options, callback);

  function callback(err, rowsAffected){
      if(err)
        console.log(err);
  };
}

module.exports = {feedMoment:feedMoment}
