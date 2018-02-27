/**
 * Created by Caro on 07.09.17.
 */

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
*/

var x = 0;
var erster;
var playerArray = [];
var ids = [];
var answerArray = [
    //100
    "Glücksrad",
    "Damit sie sich von den Kellnern unterscheiden",
    "0", // Christian Frage
    "0",
    "Zwei",
    //200
    "Peter Lustig",
    "0",
    "0", // Christian Frage
    "Flohzirkus",
    "0",
    //300
    "0",
    "0",
    "2", // Christian Frage
    "0",
    "1860 München",
    //400
    "0",
    "0",
    "0", // Christian Frage
    "0",
    "0"];


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});

app.get('/spass', function (req, res) {
    res.sendFile(__dirname + '/spass.html');
});


/**Html seiten einbinden**/
app.get('/overview', function (req, res) {
    res.sendFile(__dirname + '/overview.html');
});

app.get('/gamemaster', function (req, res) {
    res.sendFile(__dirname + '/gameMaster.html');
});

app.get('/question', function (req, res) {
    res.sendFile(__dirname + '/question.html');
});

app.get('/picturing', function (req, res) {
    res.sendFile(__dirname + '/picturing.html');
});

/**zu html seiten zugehörige .css Dateien einbinden**/
app.get('/styles/overview.css', function (req, res) {
    res.sendFile(__dirname + '/styles/overview.css');
});

app.get('/styles/client.css', function (req, res) {
    res.sendFile(__dirname + '/styles/client.css');
});

app.get('/styles/gameMaster.css', function (req, res) {
    res.sendFile(__dirname + '/styles/gameMaster.css');
});
app.get('/styles/picturing.css', function (req, res) {
    res.sendFile(__dirname + '/styles/picturing.css');
});

/**zu html seiten zugehörige .js Dateien einbinden**/
app.get('/js/client.js', function (req, res) {
    res.sendFile(__dirname + '/js/client.js');
});
app.get('/js/gameMaster.js', function (req, res) {
    res.sendFile(__dirname + '/js/gameMaster.js');
});
app.get('/js/overview.js', function (req, res) {
    res.sendFile(__dirname + '/js/overview.js');
});

/**Libraries einbinden**/
app.get('/libraries/zoomooz-master/jquery.zoomooz.js', function (req, res) {
    res.sendFile(__dirname + '/libraries/zoomooz-master/jquery.zoomooz.js');
});

app.get('/libraries/jquery-3.2.1.min.js', function (req, res) {
    res.sendFile(__dirname + '/libraries/jquery-3.2.1.min.js');
});

app.get('/libraries/jquery.blink.js', function (req, res) {
    res.sendFile(__dirname + '/libraries/jquery.blink.js');
});

app.get('/libraries/greensock-js/src/uncompressed/TimelineMax.js', function (req, res) {
    res.sendFile(__dirname + '/libraries/greensock-js/src/uncompressed/TimelineMax.js');
});

/** Graphiken einbinden **/
app.get('/graphics/BuzzCalu.png', function (req, res) {
    res.sendFile(__dirname + '/graphics/BuzzCalu.png');
});

app.get('/graphics/gold_buzzcalu.png', function (req, res) {
    res.sendFile(__dirname + '/graphics/gold_buzzcalu.png');
});

app.get('/bild1_klein.jpg', function (req, res) {
    res.sendFile(__dirname + '/bild1_klein.jpg');
});
app.get('/bild1.jpg', function (req, res) {
    res.sendFile(__dirname + '/bild1.jpg');
});
app.get('/graphics/400.png', function (req, res) {
    res.sendFile(__dirname + '/graphics/400.png');
});
app.get('/pictures/1klasse.jpg', function (req, res) {
    res.sendFile(__dirname + '/pictures/1klasse.jpg');
});

//var socket = io();

//sessionSockets.on('connection', function (err, socket, session) {
io.on('connection', function (client) {

        console.log('[socket.io] Ein neuer Client (Browser) hat sich verbunden.\n');
        console.log("id ganz am Anfang: " + client.id);
        io.emit('generateId', client.id);
        ids.push(client.id);

        // ids.push(client.id);
        /*    //} else {
                //Client ID Abfrage und Speicherung
                for (x=0; x<ids.length; x++){
                console.log("IDS: " + ids[x]);
                }
                ids.forEach(function (id) {
                    console.log("id aus dem Array: " + id);
                    if (client.id === id) {
                        io.emit('reconnect', client.id);
                    } else {
                        ids.push(client.id);
                    }

                });
            }*/

        client.on('reconnect2', function (obj) {
            console.log("reconnect");
            if (ids.length === 0) {
                console.log("Fehler");
            }
            else {
                for (x = 0; x < ids.length; x++) {
                    console.log("IDS: " + ids[x]);
                }
                //   ids.forEach(function (id) {
                for (x = 0; x < ids.length; x++) {
                    var id = ids[x];
                    console.log("id aus dem Array: " + id);
                    if (id === obj.id) {
                        console.log("ids sind gleich");
                        if (playerArray.length === 0 ){
                            playerArray.push(obj)
                        }
                        console.log("layerArray.length: " + playerArray.length);
                        io.emit('reconnect3', playerArray);
                        break;
                    } else {
                        console.log("ids sind unterschiedlich");
                        ids.push(obj.id);
                    }

                }
            }
        });


//Clients verbinden sich
        client.on('createPlayer', function (nicknameObj) {
            console.log("nicknameID in createPlayer: " + nicknameObj.id);
            if (playerArray.length !== 0) {
                console.log("dem fehler auf der spur");
                playerArray.forEach(function (player) {
                    console.log("nicknameObj.id: " + nicknameObj.id);
                    console.log("player.id: " + player.id);
                    if (nicknameObj.id !== player.id) {


                        // if (nicknameObj.id === 100) {
                        playerArray.push(nicknameObj);
                        var z = 0;
                        console.log("playerArray.length:  " + playerArray.length);
                        while (z < playerArray.length) {
                            //console.log("playerArray[x].nickname: " + playerArray[x].nickname);
                            console.log("nicknameObj.nickname: " + nicknameObj.nickname);
                            console.log("y: " + z);
                            //  console.log("playerArray.length x: " + playerArray.length[x]);

                            if (playerArray[z].nickname === nicknameObj.nickname) {
                                if (z === 0) {
                                    nicknameObj.color = "green";
                                    z++;
                                    break;
                                    //nicknameObj.id = z;
                                } else if (z === 1) {
                                    nicknameObj.color = "red";
                                    // nicknameObj.id = z;
                                    z++;
                                    break;
                                } else if (z === 2) {
                                    nicknameObj.color = "blue";
                                    // nicknameObj.id = z;
                                    z++;
                                    break;
                                } else if (z === 3) {
                                    nicknameObj.color = "yellow";
                                    // nicknameObj.id = z;
                                    z++;
                                    break;
                                } else if (z === 4) {
                                    nicknameObj.color = "purple";
                                    //  nicknameObj.id = z;
                                    z++;
                                    break;
                                } else {
                                    console.log("Kritischer Fehler!")
                                }

                                console.log("nicknameobj: " + nicknameObj.color + ",  nicknameObj.id: " + nicknameObj.id);
                            }
                            z++

                        }

                        client.nicknameObj = nicknameObj;
                        //  playerArray.push(nicknameObj);
                        console.log(nicknameObj.nickname + " just connected!");
                        //Blaue Felder im Overview füllen und gamemaster Spielerliste erstellen
                        io.emit('playerList', nicknameObj, playerArray);
                    } else {
                        console.log("reconnect");
                        io.emit('playerList', nicknameObj, playerArray);
                    }
                    //  mystorage.setItem('playerArrayStorage', JSON.stringify(playerArray));
                });
            } else {
                console.log("else");
                playerArray.push(nicknameObj);
                var z = 0;
                console.log("playerArray.length:  " + playerArray.length);
                while (z < playerArray.length) {
                    //console.log("playerArray[x].nickname: " + playerArray[x].nickname);
                    console.log("nicknameObj.nickname: " + nicknameObj.nickname);
                    console.log("y: " + z);
                    //  console.log("playerArray.length x: " + playerArray.length[x]);

                    if (playerArray[z].nickname === nicknameObj.nickname) {
                        if (z === 0) {
                            nicknameObj.color = "green";
                            z++;
                            break;
                            //nicknameObj.id = z;
                        } else if (z === 1) {
                            nicknameObj.color = "red";
                            // nicknameObj.id = z;
                            z++;
                            break;
                        } else if (z === 2) {
                            nicknameObj.color = "blue";
                            // nicknameObj.id = z;
                            z++;
                            break;
                        } else if (z === 3) {
                            nicknameObj.color = "yellow";
                            // nicknameObj.id = z;
                            z++;
                            break;
                        } else if (z === 4) {
                            nicknameObj.color = "purple";
                            //  nicknameObj.id = z;
                            z++;
                            break;
                        } else {
                            console.log("Kritischer Fehler!")
                        }

                        console.log("nicknameobj: " + nicknameObj.color + ",  nicknameObj.id: " + nicknameObj.id);
                    }
                    z++

                }
                io.emit('playerList', nicknameObj, playerArray);
            }
        });


//schnellster Buzzer wird ermittelt und an die CLients geschickt
        client.on('send_buzz', function (buzzer) {
            console.log("test2 " + buzzer.nickname);
            //var obj2 = ({ "name": $('#nameField').val(),  "pkte": 0});
            console.log('message: ' + x);
            x += 1;
            if (x === 1) {
                erster = buzzer;
                client.buzzer = buzzer;
                console.log('message3: ' + buzzer);
                console.log('message4: ' + buzzer.nickname);
                io.emit('fastest player', buzzer);


            }
        });


        client.on('trueAnswer', function (player, playerArr) {
            console.log("playerArr" + playerArr[0].nickname);
            playerArray = playerArr;
            console.log("answerArray[0]" + answerArray[0]);
            io.emit('trueAnswer', player, playerArr, answerArray);
            x = 0;
        });

        client.on('giveUp', function (player, playerArr) {

            io.emit('giveUp', player, playerArr, answerArray);
            x = 0;
        });

        client.on('wrongAnswer', function (player, playerArr) {
            console.log("playerArr:  " + playerArr[0].nickname);
            console.log("player:  " + player.nickname);
            playerArray = playerArr;
            io.emit('wrongAnswer', player, playerArr);
            x = 0;
        });

        client.on('showQuestion', function (questionArray, tdId, indx) {
            console.log("sowquestion funzt.pkte: " + questionArray[indx].text + " , " + tdId);
            if (questionArray[indx].superquestion === 1) {
                io.emit('showSuperQuestion', questionArray, tdId, indx);
            } else if (questionArray[indx].picture === 1) {
                io.emit('showPicture', questionArray, tdId, indx);
            } else {
                io.emit('showQuestion', questionArray, tdId, indx);
            }
            x = 0;
        });


        client.on('showNothing', function (questionArray, tdId, indx) {
            console.log("showNothing funzt.pkte: " + questionArray[indx].val + " , " + tdId);
            io.emit('showNothing', questionArray, tdId, indx);
            // x = 0;
        });

        /* client.on('questionHtmlOnload', function () {
         console.log("playdsd3:  " + playerArray[0].nickname);
         io.emit('questionHtmlOnload', playerArray);
         });

         client.on('overviewHtmlOnload', function () {
         if (playerArray != 'undefined') {
         console.log("playdsd: 5 " + playerArray[0].nickname);
         io.emit('overviewHtmlOnload', playerArray);
         }
         });*/

        client.on('aktPkte', function (playerArray3) {
            console.log("und3:  " + playerArray3[0].nickname);
            //console.log("und4:  " + this.playerArray[0].nickname);
            playerArray = playerArray3;
            console.log("und5:  " + playerArray3[0].nickname);

        });

    }
)
;


//http.listen(3000, function () {
server.listen(3000, function () {
    console.log('listening on *:3000');
});

