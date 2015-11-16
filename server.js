var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('studentlist', ['studentlist', 'studentlog']);
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var now = new Date();

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.get('/studentlist', function(req,res){
    
    db.studentlist.find(function(err, docs){
        res.json(docs);
    });
   
});

app.post('/studentlist', function(req,res){
    req.body._id = 0;
    //var newDate = dateFormat();
    db.studentlist.insert(req.body, function(err, doc){
        res.json(doc);
        /*
        db.studentlog.insert({
            id: doc._id,
            date: newDate,
            desc: doc.name + " was added to the point tracker."
        });
        */
    });
});

app.delete('/studentlist/:id', function(req, res){
    var id = req.params.id;
    db.studentlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);
    });
});

app.delete('/studentlog/:id', function(req, res){
    var id = req.params.id;
    db.studentlog.remove({id: mongojs.ObjectId(id)}, function(err, doc){
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
    var ptChange = Number(req.body.number);
    var startTotal = Number(0);
    var newPts = Number(0);
    var newDate = dateFormat();
    db.studentlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
        startTotal = Number(doc.pointTotal);
        newPts = ptChange + startTotal;
        db.studentlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
            update: {$set: {pointTotal: newPts}}}, function(err, doc){
            var desc = null;
            if(ptChange < 0) {
                desc = ptChange + " points were removed";
            }
            else {
                if(ptChange == 1) {
                    desc = ptChange + " point was added";
                }
                else {
                    desc = ptChange + " points were added";
                }
            }
            db.studentlog.insert({
                id: doc._id,
                date: newDate,
                desc: desc,
                description: req.body.description,
                author: req.body.author
            });
        });
        res.json(doc);
    });
});


app.get('/studentlog/:id', function(req, res){
    var search_id = req.params.id;
    db.studentlog.find({ id: mongojs.ObjectId(search_id) }, function(err, doc){
        res.json(doc);
    });
});

app.listen(3000);

console.log('Server running on port 3000');