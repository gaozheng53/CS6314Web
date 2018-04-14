var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/finalproject');

router.get('/', function(req, res) {
    var collection = db.get('User');
    collection.find({}, function(err, users){
        if (err) throw err;
      	res.json(users);
    });
});

router.post('/', function(req, res){
    var collection = db.get('User');
    collection.insert({
        username: req.body.username,
        authority: 0,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        avatar: req.body.avatar,
        address: req.body.address
    }, function(err, user){
        if (err) throw err;
        res.json(user);
    });
});




module.exports = router;