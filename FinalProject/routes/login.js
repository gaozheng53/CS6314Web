var express = require('express');
var router = express();

var monk = require('monk');
var db = monk('localhost:27017/finalproject');

router.post('/', function(req, res) {
    var collection = db.get('User');
    collection.findOne({username:req.body.username}, function(err, user){
        if (err) throw err;
        if (req.body.password === user['password']) {
          if(user['authority'] === 1) {
            res.json({'result': 2}); //admin user
          }else if(user['authority'] === 0) {
            res.json({'result': 1}); //normal user
          }else{
            console.log('login.js, wrong authority');
          }
        }else{
          res.json({'result': 0});
        }
    });
});

module.exports = router;

