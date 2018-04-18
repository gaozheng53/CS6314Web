var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/finalproject');

router.get('/', function(req, res) {
    var collection = db.get('Cart');
    collection.find({}, function(err, cart){
        if (err) throw err;
      	res.json(cart);
    });
});

router.post('/', function(req, res){
    console.log("/");
});

router.post('/:id', function(req, res){
    console.log("/:id");
    var collection = db.get('Cart');
    collection.insert({
        username: "Zheng",
        name: req.body.dishname,
        price: req.body.price,
        count: 1     
    }, function(err, cart){
        if (err) throw err;
        res.json(cart);
    });
});



router.delete('/:id', function(req, res){
    var collection = db.get('Cart');
    collection.remove({ _id: req.params.id }, function(err, cart){
        if (err) throw err;

        res.json(cart);
    });
});

module.exports = router;