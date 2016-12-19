var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:true});
var port = process.env.PORT || 1337;
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/todo';
//Dumb* required stuff that I still only half understand.(*not actually dumb)

app.use(express.static('public'));
//this is pretty important too, sets the public folder as static
app.listen(port, function(req, res){
  console.log("Listenin' in, yo!");
});//opens port 1337 and/or whatever port other things use.

app.get('/',function(req,res){
console.log("Here, have a website!");
res.sendFile(path.resolve('public/index.html'));
});//Not 100% sure this bit isn't redundant... I think it also gives the index.html, but it seems to work without it too.

app.post('/post', urlEncodedParser, function( req, res ){
  console.log("We're posting something!", req.body);
  var insert = req.body.package;//puts the input into another variable.
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log('Oh for gods sake. Its broken...');
    } else {
      console.log("Connected!");
      client.query('INSERT INTO list (task, complete) values ( $1, FALSE )', [insert]); //shoves the given input into the daytuhbayse.
      done();
      res.send("Done!");
    }//end else!
  });//end PG connect!
});//end post!

app.get('/get', function( req, res ){
  console.log("Oh hot damn, client wants some info");
  pg.connect(connectionString, function (err, client, done){
    if(err){
      console.log("Whad you do to break it!?");
    } else {
      console.log("Hacking, er, connection established..");
      var query = client.query("SELECT * FROM list");
      var array = [];
      query.on('row', function(row){
        array.push(row);
      });
      query.on('end', function(){
        done();
        console.log(array);
        res.send(array);
      });
    }
  });
});
app.put('/putdone', urlEncodedParser , function( req, res ){
  console.log("good job!", req.body);
  pg.connect(connectionString, function( err, client, done){
    if( err ){
      console.log("s'broken");
    } else {
      console.log('Editing!');
      var query = client.query('UPDATE list SET (complete) = (TRUE) WHERE id = ($1)', [req.body.task]);
      query.on('row', function(row){
        console.log("changed", row);
      });
      query.on('end', function(){
        done();
        res.send("Complete!");
      });
    }
  });
});
app.delete('/deletetask', urlEncodedParser, function( req, res ){
  console.log("Deleting!", req.body);
  pg.connect(connectionString, function( err, client, done ){
    if( err ){
      console.log("delete failed");
    }else{
      var query = client.query('DELETE FROM list WHERE id = ($1)',[req.body.task]);
      query.on('row', function(row){
        console.log("deleted", row);
      });
      query.on('end',function(){
        done();
        res.send("Complete!");
      });
    }
  });
});
