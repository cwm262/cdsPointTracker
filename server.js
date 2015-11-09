var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('studentlist', ['studentlist']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.get('/studentlist', function(req,res){
    
    db.studentlist.find(function(err, docs){
        res.json(docs);
    });
   
});

app.post('/studentlist', function(req,res){
    req.body._id=0;
    db.studentlist.insert(req.body, function(err, doc){
        res.json(doc);    
    });
});

app.delete('/studentlist/:id', function(req, res){
    var id = req.params.id;
    db.studentlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);    
    });
});

app.get('/studentlist/:id', function(req,res){
    var id = req.params.id;
    db.studentlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);    
    });
});

app.put('/studentlist/:id', function(req,res){
    var id = req.params.id;
    db.studentlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
        update: {$set: {name: req.body.name, pawPrint: req.body.pawPrint, pointTotal: req.body.pointTotal}},
        new: true}, function(err, doc){
        res.json(doc);
    });
});

app.listen(3000);

console.log('Server running on port 3000');