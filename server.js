var express = require('express');
var app = express();
var mongojs = require('mongojs');
var mongoose = require('mongoose');
var db = mongojs('studentlist', ['studentlist', 'studentlog', 'studentwarnings']);
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var cors = require('cors');
var methodOverride = require('method-override');
var now = new Date();

mongoose.connect('mongodb://localhost/userDatabase');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + "/public"));

require('./server/auth')(app);
require('./server/basic')(app);

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

app.post('/studentwarnings/:id', function(req,res){
    var id = req.params.id;
    var newDate = dateFormat();
    db.studentwarnings.insert({
        id: id,
        date: newDate,
        type: req.body.type,
        description: req.body.description,
        author: req.body.author
    }, function(err, doc){
        res.json(doc);
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

app.delete('/studentwarnings/:id', function(req,res){
    var id = req.params.id;
    db.studentwarnings.remove({id: id}, function(err,doc){
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

app.get('/studentlist', function(req,res){

    db.studentlist.find(function(err, docs){
        res.json(docs);
    });

});

app.get('/studentlist/:id', function(req,res){
    var id = req.params.id;
    db.studentlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);
    });
});

app.get('/studentlog/:id', function(req, res){
    var search_id = req.params.id;
    db.studentlog.find({ id: mongojs.ObjectId(search_id) }, function(err, doc){
        res.json(doc);
    });
});

app.get('/studentwarnings/:id', function(req, res){
    var sid = req.params.id;
    db.studentwarnings.find({ id: sid }, function(err, doc){
        res.json(doc);
    });
});

app.listen(3000);

console.log('Server running on port 3000');

exports = module.exports = app;