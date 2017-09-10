/**
 * Created by Caro on 07.09.17.
 */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var x = 0;
var erster;
var playerArray = new Array;


// Laden von Socket.io
//(Gibt für die Demo nur Fehler/Warnungen auf der Konsole aus)
//var io = require('socket.io').listen(app).set('log level', 1);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});

app.get('/overview', function (req, res) {
    res.sendFile(__dirname + '/overview.html');
});

//var socket = io();

io.on('connection', function (client) {
    console.log('[socket.io] Ein neuer Client (Browser) hat sich verbunden.\n');
    //playerArray.push(client);
    //socket.emit('welcome', "Hello world");

    //Clients verbinden sich
    client.on('set nickname', function (nicknameObj) {

        client.nicknameObj = nicknameObj;

        console.log(nicknameObj.nickname + " just connected!");
        io.emit('playerList', nicknameObj);
    });
//});


//io.on('send_buzz', function (client) {

//schnellster Buzzer wird ermittelt und an die CLients geschickt
    client.on('send_buzz', function (buzzer) {
        console.log("test2 " + buzzer);
        //var obj2 = ({ "name": $('#nameField').val(),  "pkte": 0});
        console.log('message: ' + x);
        x += 1;
        console.log('message3: ' + x);
        if (x == 1) {
            erster = buzzer;
            client.buzzer = buzzer;
            io.emit('fastest player', buzzer);
            console.log('message2: ' + x);

        }
        // socket.emit("Neuer Spieler: " + obj2.name + "Punkte: " + obj2.pkte);
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

