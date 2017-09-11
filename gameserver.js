/**
 * Created by Caro on 07.09.17.
 */


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var x = 0;
var erster;
var playerArray = new Array;


//(Gibt für die Demo nur Fehler/Warnungen auf der Konsole aus)
//var io = require('socket.io').listen(app).set('log level', 1);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});

app.get('/spass', function (req, res) {
    res.sendFile(__dirname + '/spass.html');
});




app.get('/overview', function (req, res) {
    res.sendFile(__dirname + '/overview.html');
});

app.get('/gamemaster', function (req, res) {
    res.sendFile(__dirname + '/gameMaster.html');
});

app.get('/styles/overview.css', function (req, res) {
    res.sendFile(__dirname + '/styles/overview.css');
});

app.get('/styles/client.css', function (req, res) {
    res.sendFile(__dirname + '/styles/client.css');
});
app.get('/styles/gameMaster.css', function (req, res) {
    res.sendFile(__dirname + '/styles/gameMaster.css');
});

app.get('/js/client.js', function (req, res) {
    res.sendFile(__dirname + '/js/client.js');
});
app.get('/js/gameMaster.js', function (req, res) {
    res.sendFile(__dirname + '/js/gameMaster.js');
});
app.get('/js/overview.js', function (req, res) {
    res.sendFile(__dirname + '/js/overview.js');
});
//var socket = io();

io.on('connection', function (client) {
    console.log('[socket.io] Ein neuer Client (Browser) hat sich verbunden.\n');

    //Clients verbinden sich
    client.on('set nickname', function (nicknameObj) {

        client.nicknameObj = nicknameObj;
        //  playerArray.push(nicknameObj);
        console.log(nicknameObj.nickname + " just connected!");
        io.emit('playerList', nicknameObj);
    });

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
            console.log('message3: ' + buzzer);
            console.log('message4: ' + buzzer.nickname);
            io.emit('fastest player', buzzer);


        }
    });

    /*client.on('questionStart', function (questionArray) {
        console.log("questionStart");
        io.emit('questionStart',questionArray);
    });
*/
    client.on('trueAnswer', function (schnellster) {

        console.log(schnellster.nickname + " kriegt Punkte!!");
        io.emit('trueAnswer', schnellster);

    });

    client.on('wrongAnswer', function (schnellster) {
        console.log("schnellster.pkte: " + schnellster.pkte);
        io.emit('wrongAnswer', schnellster);
    });

    client.on('showQuestion', function (questionArray, tdId) {
        console.log("sowquestion funzt.pkte: ");
        io.emit('showQuestion', questionArray, tdId);
    });



});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

