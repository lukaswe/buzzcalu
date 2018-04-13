/**
 * Created by Caro on 07.09.17.
 */
var express = require('express');
var app = express();

var basicAuth = require('basic-auth-connect');

var server = require('http').Server(app);
var io = require('socket.io')(server);
/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
*/

var x = 0;
var z = 0;
var erster;
var playerArray = [],
    gamemasterArray = [],
    overviewArray = [];
var ids = [],
    currentQuestionObj,
    fastestPlayer = {},
    fs = require('fs'),
    path = require('path'),
    playerObject = {},
    readStream = fs.createReadStream(path.resolve(__dirname, './pictures/1klasse.jpg'), {
        encoding: 'binary'
    }), chunks = [], delay = 0;


// var questionArray = [];
var answerArray = require('./data/answers');
var questionArray = require('./data/questions');


var router = express.Router();
router.use(basicAuth('admin', 'test1234'));
router.use(express.static('admin'));

app.use(express.static('public'));
app.use(express.static('js'));
app.use('/admin/', router);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client.html');
});

app.get('/spass', function (req, res) {
    res.sendFile(__dirname + '/spass.html');
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
/*app.get('/styles/overview.css', function (req, res) {
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
app.get('/styles/animate.css', function (req, res) {
    res.sendFile(__dirname + '/styles/animate.css');
});*/


/**zu html seiten zugehörige .js Dateien einbinden**/
/*
app.get('/js/client.js', function (req, res) {
    res.sendFile(__dirname + '/js/client.js');
});
app.get('/js/gameMaster.js', function (req, res) {
    res.sendFile(__dirname + '/js/gameMaster.js');
});
app.get('/js/overview.js', function (req, res) {
    res.sendFile(__dirname + '/js/overview.js');
});
*/

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

app.get('/JeopardyTheme.mp3', function (req, res) {
    res.sendFile(__dirname + '/JeopardyTheme.mp3');
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
        //  console.log("id ganz am Anfang: " + client.id);
        //  io.emit('generateId', client.id);


        //io.emit('emptyReloadLocalstorage');

        client.on('reconnectPlayer', function (playerid) {
            console.log("reconnectPlayer");
            if (playerArray.length !== 0) {
                playerArray.forEach(function (player) {
                    console.log("olayerarray player in reconnectPlayer: " + player.nickname + ", id: " + player.id + "playerid: " + playerid);
                    if (player.id != playerid) { //MUSS != sein, sonst bugts rum.
                        console.log("Nicht in SpielerListe");
                    } else {
                        console.log("player ist in playerArray");
                        io.emit('reconnectPlayer', player);
                        //io.emit('emptyReloadLocalstorage');
                        // io.emit('reconnectNotPlayer', playerArray);
                        //io.emit('playerList', player, playerArray);
                    }
                });
            }
            else {
                console.log("reconnectPlayer hat playerArray größe 0 ");
                //  clientArray = [];
                io.emit('emptyLocalstorage');

            }
        });

        client.on('reconnectNotPlayerOverview', function (id) {
            console.log("reconnectNotPlayer id: " + id);
            console.log("clientArray.length: " + overviewArray.length);
            if (overviewArray.length > 0) {
                overviewArray.forEach(function (clientid) {
                    console.log('client.id: ' + clientid);
                    if (clientid == id) {
                        console.log('reconnectNotPlayerOverview ist im array');
                        console.log("playerArray.length: " + playerArray.length);
                        io.emit('reconnectNotPlayerOverview', playerArray, questionArray, tdId, indx);
                    }
                })
            } else {
                console.log("Client noch nicht registriert.");
                io.emit('emptyLocalstorageOverview');
            }
        });


        client.on('reconnectNotPlayerGamemaster', function (id) {
            console.log("reconnectNotPlayerGamemaster");
            console.log("reconnectNotPlayerGamemaster id: " + id);
            console.log("gamemasterArray.length: " + gamemasterArray.length);
            if (gamemasterArray.length == 0) {

                var iid = client.id;
                console.log("register iid: " + iid);
                gamemasterArray.push(iid);
                console.log("gamemasterArray.length: " + gamemasterArray.length);
                io.emit('registerGamemaster', iid, questionArray, answerArray);
            } else {
                gamemasterArray.forEach(function (gamemaster) {
                    console.log("gamemaster: " + gamemaster);
                    if (gamemaster == id) {
                        console.log('id: ' + id);
                        console.log('reconnectNotPlayerGamemaster ist im array');
                        io.emit('reconnectNotPlayerGamemaster', playerArray, questionArray, tdId, indx, answerArray);

                    } else {
                        console.log("Client noch nicht registriert.");
                        var iid = client.id;
                        console.log("register iid: " + iid);
                        gamemasterArray.push(iid);
                        console.log("clientArray.length: " + gamemasterArray.length);
                        io.emit('registerGamemaster', iid, questionArray, answerArray);
                        //  io.emit('emptyLocalstorageGamemaster');
                    }
                })
            }

        });

        client.on('registerOverview', function () {

            var iid = client.id;
            console.log("register iid: " + iid);
            overviewArray.push(iid);
            console.log("clientArray.length: " + overviewArray.length);
            io.emit('registerOverview', iid);
            //   io.emit('questionArrayStorageOverview', questionArray);

        });
        client.on('registerGamemaster', function () {

            var iid = client.id;
            console.log("register iid: " + iid);
            gamemasterArray.push(iid);
            console.log("gamemasterArray.length: " + gamemasterArray.length);
            io.emit('registerGamemaster', iid, questionArray);
            //  io.emit('questionArrayStorage', questionArray);

        });


        //Clients verbinden sich
        client.on('createPlayer', function (nickname, id) {
            console.log("createPlayer: ", nickname);
            if (nickname !== null) {
                //console.log("Client.id in createPlayer:  " + client.id);
                console.log("Client.id in createPlayer:  " + id);
                playerObject = ({"id": id, 'nickname': nickname, "pkte": 0, "gameColor": "white", "nr":100});
                console.log("z: " + z);

                while (z < (playerArray.length + 1)) {

                    if (z == 0) {
                        playerObject.color = "green";
                        playerObject.nr = z;
                        z++;
                        break;
                        //nicknameObj.id = z;
                    } else if (z == 1) {
                        playerObject.color = "red";
                        playerObject.nr = z;
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z == 2) {
                        playerObject.color = "blue";
                        playerObject.nr = z;
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z == 3) {
                        playerObject.color = "yellow";
                        // nicknameObj.id = z;
                        playerObject.nr = z;
                        z++;
                        break;
                    } else if (z == 4) {
                        playerObject.color = "purple";
                        //  nicknameObj.id = z;
                        playerObject.nr = z;
                        z++;
                        break;
                    } else if (z == 5) {
                        playerObject.color = "black";
                        //  nicknameObj.id = z;
                        playerObject.nr = z;
                        z++;
                        break;
                    } else {
                        console.log("Kritischer Fehler!")
                    }

                    console.log("nicknameobj: " + playerObject.color + ",  playerObject.id: " + playerObject.id);
                    z++
                }
                playerArray.push(playerObject);
                //Blaue Felder im Overview füllen und gamemaster Spielerliste erstellen
                io.emit('playerList', playerObject, playerArray);
            } else {
                console.log("nickname nicht gesetzt");
            }
        });


//schnellster Buzzer wird ermittelt und an die CLients geschickt
        client.on('send_buzz', function (id, test) {


            var boo = false;
            console.log("x: " + x);
            x += 1;
            console.log("x1: " + x);
            if (x == 1) {
                playerArray.forEach(function (player) {

                    // while (boo = false) {
                    console.log("player.id in sendbuzz: " + player.id + ", id: " + id);
                    if (player.id == id) {

                        console.log("player.id in sendbuzz: " + player.id + ', player.nickname: ' + player.nickname);
                        erster = player;
                        io.emit('fastest player', player, test);
                        fastestPlayer = player;
                    }
                    else {
                        //                          console.log("ungültiger Mitspieler.");
                    }
                });
            }


        });


        var tdId;
        var indx;
        client.on('showQuestion', function (tdId2) {
            x = 0;
            //  console.log("clientArray Länge in showquestion: " + clientArray.length);
            tdId = tdId2;
            console.log("tdId2 vorne: " + tdId2);
            console.log("oplayerarray.length in showquestion: " + playerArray.length);
            /**Hier anzahl der fragen anpassen**/
            //for (var anzahlDerFragen = 0; anzahlDerFragen < 16; anzahlDerFragen ++) {
            if (tdId.length < 10) {
                indx = tdId2.substring(tdId2.length - 1, tdId2.length);
            } else {
                indx = tdId2.substring(tdId2.length - 2, tdId2.length);
            }

            if (questionArray[indx].erledigt == 0) {
                //Frage als erledigt markieren.

                // if (questionArray[indx].val % 2 === 1) {
                //     socket.emit('showNothing', questionArray, tdId2, indx);
                //     document.getElementById(tdId).innerHTML = "erledigt";
                // } else {
                if (questionArray[indx].superquestion == 1) {
                    console.log("superquestion");
                    io.emit('showSuperQuestion', questionArray, tdId2, indx);
                    questionArray[indx].erledigt = 1;
                } else if (questionArray[indx].picture == 1) {
                    console.log("picture");
                    /**Bildübertragung**/

                    readStream.on('readable', function () {
                        console.log("Image Loading");
                    });
                    readStream.on('data', function (chunk) {
                        chunks.push(chunk);
                        console.log(" Sending Image ");
                        io.emit('showPicture', questionArray, tdId2, indx, chunk);
                        // io.emit('img-chunk', chunk);
                    });

                    readStream.on('end', function () {
                        console.log("Image loaded");
                    });
                    /**Bildübertragung Ende**/
                    //io.emit('showPicture', questionArray, tdId2, indx, chunk);
                    // io.emit('img-chunk');
                    questionArray[indx].erledigt = 1;
                } else {
                    console.log("normale Frage");
                    io.emit('showQuestion', questionArray, tdId2, indx);
                    questionArray[indx].erledigt = 1;
                }
                //}
                currentQuestionObj = questionArray[indx];
                //  questionArray[indx].val += 1;
                //questionArray[indx].erledigt = 1;
            } else {
                console.log("Die Frage ist schon erledigt.")
            }
            x = 0;
        });


        client.on('trueAnswer', function (fastestPlayer) {
            console.log("in trueAnswer, schnellster: " + fastestPlayer.nickname);

            playerArray.forEach(function (player) {
                if (fastestPlayer.id == player.id) {
                    player.pkte += currentQuestionObj.pkte;
                    console.log("schnellster Spieler, this.playerArray: " + player.nickname);
                    io.emit('trueAnswer', player, playerArray, answerArray, tdId, indx, questionArray);
                    //  $('#schnellster-text').text("...");
                }
            });
            x = 0;
        });

        client.on('giveUp', function () {


            io.emit('giveUp', playerArray, answerArray, tdId, indx, questionArray);
            x = 0;
        });

        client.on('showTable', function () {
            io.emit('showTable');
        });

        client.on('wrongAnswer', function (fastestPlayer) {
            console.log("in wrongAnswer, playerArray[0].nickname:  " + fastestPlayer.id);
            var boo = false;

            playerArray.forEach(function (player) {
                //while (boo == false) {
                console.log("player.id: " + player.id);
                console.log("fastestPlayer.id: " + fastestPlayer.id);
                if (fastestPlayer.id == player.id) {
                    player.pkte -= currentQuestionObj.pkte;
                    console.log("in wrongAnswer, playerpkte:  " + player.pkte);
                    io.emit('wrongAnswer', player, playerArray, tdId, indx);
                    boo = true;
                } else {
                    // console.log("irgendwas läuft schief.");
                }
                //   }
            });

            x = 0;


        });

        client.on('backToOverview', function () {
            console.log("backToOverview: " + playerArray[0].nickname);
            io.emit('backToOverview', playerArray);

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

        client.on('letsStart', function () {
            io.emit('letsStart');
            console.log("Es geht los :)");
        });

        client.on('buzzerTest', function () {
            io.emit('buzzerTest');
            console.log("Buzzzzzertest");
        });
        client.on('winner', function () {
            var winnerPkte = 0,
            winnerObj;
            playerArray.forEach(function (player) {
                if (winnerPkte <= player.pkte){
                    winnerObj = player;
                }
            });
            console.log("winnerObj "+ winnerObj.nickname) ;
            io.emit('winner', winnerObj);
            //console.log("winnerbutton funzt");
        });

        client.on('buzzerKlappt', function (id, test) {
            console.log("test: " + test);
            if (test) {
                console.log("test ist true");
                playerArray.forEach(function (player) {

                    // while (boo = false) {
                    console.log("player.id in sendbuzz: " + player.id + ", id: " + id);
                    if (player.id == id) {
                        io.emit('buzzerKlappt', player.nickname, id);
                    }
                });
            }
            io.emit('buzzerTest');
            console.log("Buzzzzzertest");
        });

    }
)
;


//http.listen(3000, function () {
server.listen(3000, function () {
    console.log('listening on *:3000');
});

