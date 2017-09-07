/**
 * Created by Caro on 07.09.17.
 */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var first=0;
var safemsg;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client.html');
});

app.get('/overview', function(req,res){
    res.sendFile(__dirname + '/overview.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
    first +=1;

        if (first == 1 ) {
            safemsg = msg;
            io.emit('chat message', msg);
            console.log('message: ' + first);
            console.log('message: ' + safemsg);
        }
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


