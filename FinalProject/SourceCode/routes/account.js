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

// get specific  account
router.get('/:username', function(req, res) {
    var collection = db.get('User');
    collection.findOne({ username: req.params.username }, function(err, user){
        if (err) throw err;

        res.json(user);
    });
});


// update account   excluding username and password
router.put('/:username', function(req, res){
    var collection = db.get('User');
    collection.update({
            username: req.params.username
        },
        {
            username: req.body.username,
            password: req.body.password,
            authority: req.body.authority,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            avatar: req.body.avatar,
            address: req.body.address,
        }, function(err, user){
            if (err) throw err;

            res.json(user);
        });
});


// create an account
router.post('/', function(req, res){
    var collection = db.get('User');
    var collection_cart = db.get('Cart');
    var collection_order = db.get('Order');
    console.log("进入router");
    collection.findOne({username:req.body.username}, function(err, user){
        if (err) {
            throw err;
        }else if(user){
            console.log("加购物车不成功");
            res.json({'message': false,'result':0});
        }else{
            collection.insert({
                username: req.body.username,
                authority: 0,
                password: req.body.password,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address
            }, function(err, user){
                if (err) throw err;
                res.json({'message': true,'result':1}); 
            });
            // initial this user's cart
            console.log("加购物车成功");
            collection_cart.insert({
                username: req.body.username,
                items: {}
            },function(err,cart){
                if(err) throw err;
            });
            console.log("加历史订单成功");
            collection_order.insert({
                username: req.body.username,
                orders: []
            },function(err,cart){
                if(err) throw err;
            });
        }
    });
});

// update password
router.post('/:id', function(req, res){
    var collection = db.get('User');
    collection.update({
            _id: req.params.id
        },
        {
            $set : {password :req.body.password}
        }, function(err, user){
            if (err) throw err;

            res.json(user);
        });
});




module.exports = router;