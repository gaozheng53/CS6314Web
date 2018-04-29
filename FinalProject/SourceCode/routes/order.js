var express = require('express');
var router = express();

var monk = require('monk');
var db = monk('localhost:27017/finalproject');
router.get('/', function(req, res) {
    var collection = db.get('Order');
    collection.find({}, function(err, order){
        if (err) throw err;
        res.json(order);
    });
});

// update cart  :id should be dish id
router.post('/:id', function(req, res){
    console.log("update order");
    var collection = db.get('Order');
    collection.update({
            _id: req.params.id
        },
        {
            $set : {orders :req.body.orders}
        }, function(err, order){
            if (err) throw err;

            res.json(order);
        });
});

module.exports = router;