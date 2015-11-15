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
    req.body._id=0;
    var newDate = dateFormat();
    db.studentlist.insert(req.body, function(err, doc){
        db.studentlog.insert({
            id: doc._id,
            date: newDate,
            desc: doc.name + " was added to the point tracker with " + doc.pointTotal + " points."
        });
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
    var startTotal = 0;
    var newDate = dateFormat();
    db.studentlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
        startTotal = doc.pointTotal;
    });
    db.studentlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
        update: {$set: {name: req.body.name, pawPrint: req.body.pawPrint, pointTotal: req.body.pointTotal}},
        new: true}, function(err, doc){
            var desc = null;
            if(startTotal != doc.pointTotal){
                var change = startTotal - doc.pointTotal;
                var ptsToBeAdded = 0;
                if(change < 0){
                    ptsToBeAdded = change*-1;
                    if(ptsToBeAdded == 1){
                        desc = "1 point was added.";
                    }
                    else{
                        desc = ptsToBeAdded + " points were added.";
                    }
                }
                else{
                    ptsToBeAdded = change;
                    if(ptsToBeAdded == 1){
                        desc = "1 point was removed.";
                    }
                    else{
                        desc = ptsToBeAdded + " points were removed."
                    }
                }
                db.studentlog.insert({
                    id: doc._id,
                    date: newDate,
                    desc: desc
                });
            }
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