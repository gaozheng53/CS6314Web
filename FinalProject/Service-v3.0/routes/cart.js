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

// get cart for specific user
router.get('/:id', function(req, res) {
    console.log("get/:id");
    var collection = db.get('Cart');
    collection.findOne({ _id: req.params.id }, function(err, cart){
        if (err) throw err;

        res.json(cart);
    });
});

// update cart  :id should be dish id
router.post('/:id', function(req, res){
    // req.body.items.push();
    // req.body.items.push({"dishname":"Shrimp Dumpling","price":10});
    console.log("update cart",req.body);
    var collection = db.get('Cart');
    collection.update({
            _id: req.params.id
        },
        {
            $set : {items :req.body.items}
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