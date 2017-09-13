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

app.get('/question', function (req, res) {
    res.sendFile(__dirname + '/question.html');
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
        playerArray.push(nicknameObj);
        var x = 0;
        console.log("playerArray.length:  " + playerArray.length);
        while (x < playerArray.length) {
            //console.log("playerArray[x].nickname: " + playerArray[x].nickname);
            console.log("nicknameObj.nickname: " + nicknameObj.nickname);
            console.log("x: " + x);
            //  console.log("playerArray.length x: " + playerArray.length[x]);
            if (playerArray[x].nickname == nicknameObj.nickname) {
                if (x == 0) {
                    nicknameObj.color = "green";
                    nicknameObj.id = x;
                } else if (x == 1) {
                    nicknameObj.color = "red";
                    nicknameObj.id = x;
                } else if (x == 2) {
                    nicknameObj.color = "blue";
                    nicknameObj.id = x;
                } else if (x == 3) {
                    nicknameObj.color = "yellow";
                    nicknameObj.id = x;
                } else if (x == 4) {
                    nicknameObj.color = "purple";
                    nicknameObj.id = x;
                } else {
                    console.log("Kritischer Fehler!")
                }
                console.log("nicknameobj: " + nicknameObj.color + "nicknameObj.id " + nicknameObj.id);
            }
            x++
        }

        client.nicknameObj = nicknameObj;
        //  playerArray.push(nicknameObj);
        console.log(nicknameObj.nickname + " just connected!");
        //Blaue Felder im Overview füllen und gamemaster Spielerliste erstellen
        io.emit('playerList', nicknameObj, playerArray);
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
    client.on('trueAnswer', function (player, playerArr) {
        console.log("playerArr" + playerArr[0].nickname);
        playerArray = playerArr;
        io.emit('trueAnswer', player, playerArr);

    });

    client.on('wrongAnswer', function (player, playerArr) {
        console.log("playerArr" + playerArr[0].nickname);
        playerArray = playerArr;
        io.emit('wrongAnswer', playerArr);
    });

    client.on('showQuestion', function (questionArray, tdId, indx) {
        console.log("sowquestion funzt.pkte: " + questionArray[indx] + " , " + tdId);
        io.emit('showQuestion', questionArray, tdId, indx);
        x = 0;
    });

    client.on('questionHtmlOnload', function () {
        console.log("playdsd3:  " + playerArray[0].nickname);
        io.emit('questionHtmlOnload', playerArray);
    });

    client.on('overviewHtmlOnload', function () {
        if (playerArray != 'undefined') {
            console.log("playdsd: 5 " + playerArray[0].nickname);
            io.emit('overviewHtmlOnload', playerArray);
        }
    });

    client.on('aktPkte', function (playerArray3) {
        console.log("und3:  " + playerArray3[0].nickname);
        //console.log("und4:  " + this.playerArray[0].nickname);
        playerArray = playerArray3;
        console.log("und5:  " + playerArray3[0].nickname);

    });

})
;


http.listen(3000, function () {
    console.log('listening on *:3000');
});

