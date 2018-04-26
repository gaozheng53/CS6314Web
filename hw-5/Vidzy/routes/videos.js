var express = require('express');
var router = express.Router();

var monk = require('monk');
// Using monk to connect mongodb
var db = monk('localhost:27017/vidzy');


router.get('/', function(req, res) {
    var collection = db.get('videos');
    collection.find({}, function(err, videos){
        if (err) throw err;
      	res.json(videos);
    });
});

router.post('/', function(req, res){
    var collection = db.get('videos');
    collection.insert({
       
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

router.get('/:id', function(req, res) {
    var collection = db.get('videos');
    collection.findOne({ _id: req.params.id }, function(err, video){
        if (err) throw err;

      	res.json(video);
    });
});


router.put('/:id', function(req, res){
    var collection = db.get('videos');
    collection.update({
        _id: req.params.id
    },
    {
        $set : {title :req.body.title},
        $set : {description :req.body.description}

    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});



router.delete('/:id', function(req, res){
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

module.exports = router;

