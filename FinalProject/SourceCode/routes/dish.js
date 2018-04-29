var express = require('express');
var router = express();

var monk = require('monk');
var db = monk('localhost:27017/finalproject');
router.get('/', function(req, res) {
    var collection = db.get('Menu');
    collection.find({}, function(err, user){
        if (err) throw err;
        res.json(user);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Menu');
    collection.insert({
        name: req.body.name,
        class: req.body.class,
        picture: req.body.picture,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description
    }, function(err, dish){
        if (err) throw err;
        res.json(dish);
    });
});

// Edit dish
router.get('/:id', function(req, res) {
    var collection = db.get('Menu');
    collection.findOne({ _id: req.params.id }, function(err, dish){
        if (err) throw err;

        res.json(dish);
    });
});

// update dish
router.put('/:id', function(req, res){
    var collection = db.get('Menu');
    collection.update({
            _id: req.params.id
        },
        {
            name: req.body.name,
            class: req.body.class,
            picture: req.body.picture,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description
        }, function(err, dish){
            if (err) throw err;

            res.json(dish);
        });
});

router.post('/:id', function(req, res){
    var collection = db.get('Menu');
    collection.update({
            _id: req.params.id
        },
        {
            name: req.body.name,
            class: req.body.class,
            picture: req.body.picture,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description
        }, function(err, dish){
            if (err) throw err;

            res.json(dish);
        });
});

module.exports = router;

