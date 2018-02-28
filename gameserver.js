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
var playerArray = [],
 clientArray = [];
var ids = [],
    currentQuestionObj,
    fastestPlayer={};
var playerObject = {},

    answerArray = [
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
        "0"],
    questionArray = [
        {
            "id": 0,
            "text": "An welcher Gameshow nahm Angela Merkel einst teil?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 1,
            "erledigt": 0
        },
        {   <!-- Conny Frage -->
            "id": 1,
            "text": "Warum tragen die Herren auf dem Wiener Opernball weiße Fliegen?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Christian Frage -->
            "id": 2,
            "text": "Haben Fliegen Flügel5?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id": 3,
            "text": "Haben Fliegen Flügel?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {   <!--Schätzfrage-->
            "id": 4,
            "text": "Haben Fliegen Flügel?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },

        {
            "id": 5,
            "text": "Wie viele Golfbälle liegen auf dem Mond?",
            "pkte": 200,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {    <!-- Conny Frage -->
            "id": 6,
            "text": "Wer war als Tontechniker für die Ich bin ein Berliner-Rede von John F. Kennedy verantwortlich ?",
            "pkte": 200,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Christian Frage -->
            "id": 7,
            "text": "Haben Fliegen Flügel?",
            "pkte": 200, "val": 0, "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id": 8,
            "text": "Haben Fliegen Flügel?",
            "pkte": 200,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {   <!--Schätzfrage-->
            "id":9,
                "text": "Haben Fliegen Flügel?",
            "pkte": 200,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },

        {
            "id":10,
            "text": "Was hat das Münchener Oktoberfest im Gegensatz zu anderen Volksfesten zu bieten?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {    <!-- Conny Frage -->
            "id":11,
            "text": "Haben Fliegen Flügel?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Christian Frage -->
            "id":12,
            "text": "Wie viele der hier anwesenden Hochzeitsgäste waren bereits mit Christian zusammen in der 1. Klasse?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 1,
            "erledigt": 0
        },
        {
            "id":13,
            "text": "Was zur Hölle?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },


        {   <!--Schätzfrage-->
            "id":14,
                "text": "Was zur Hölle?",
            "pkte": 300,
            "val": 0, "superquestion": 0,
            "picture": 0, "erledigt": 0
        },

        {
            "id":15,
            "text": "Bild",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {    <!-- Conny Frage -->
            "id":16,
            "text": "Haben Fliegen Flügel?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Christian Frage -->
            "id":17,
            "text": "Papst Franziskus ist Ehrenmitglied des Fußballvereins ...?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id":18,
            "text": "Was zur Hölle?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {   <!--Schätzfrage-->
            "id":19,
            "text": "Was zur Hölle2?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        }];


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
        //  console.log("id ganz am Anfang: " + client.id);
        //  io.emit('generateId', client.id);


        //io.emit('emptyReloadLocalstorage');

        client.on('reconnectPlayer', function (playerid) {
            console.log("reconnectPlayer");
            if (playerArray.length !== 0) {
                playerArray.forEach(function (player) {
                    if (player.id === playerid) {
                        console.log("player ist in playerArray");
                        io.emit('reconnectPlayer', player);
                        io.emit('emptyReloadLocalstorage');
                        // io.emit('reconnectNotPlayer', playerArray);
                        //io.emit('playerList', player, playerArray);
                    }
                });
            }
            else {
                console.log("reconnectPlayer hat playerArray größe 0 ");
                clientArray = [];
                io.emit('emptyLocalstorage');

            }
        });

        client.on('reconnectNotPlayer',function(id){
            console.log("reconnectNotPlayer");
            console.log("reconnectNotPlayer id: " + id);
            console.log("clientArray.length: " + clientArray.length);
            if (clientArray.length > 0) {
                clientArray.forEach(function (clientid) {
                    console.log('client.id: ' + clientid);
                    if (clientid === id) {
                        console.log('reconnectNotPlayer');
                        io.emit('reconnectNotPlayer', playerArray, questionArray, tdId, indx);
                    }

                })
            }else{console.log("Client noch nicht registriert.");}

        });

        client.on('register', function(){

            var iid = client.id;
            console.log("register iid: "+ iid);
            clientArray.push(iid);
            io.emit('register', iid);
            io.emit('questionArrayStorage', questionArray);

        });


        //Clients verbinden sich
        client.on('createPlayer', function (nickname) {
            console.log("createPlayer", nickname);
            if(nickname !== null) {
                console.log("Client.id in createPlayer:  " + client.id);
                playerObject = ({"id": client.id, 'nickname': nickname, "pkte": 0, "gameColor": "white"});

                var z = 0;
                while (z < (playerArray.length + 1)) {

                    if (z === 0) {
                        playerObject.color = "green";
                        z++;
                        break;
                        //nicknameObj.id = z;
                    } else if (z === 1) {
                        playerObject.color = "red";
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z === 2) {
                        playerObject.color = "blue";
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z === 3) {
                        playerObject.color = "yellow";
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z === 4) {
                        playerObject.color = "purple";
                        //  nicknameObj.id = z;
                        z++;
                        break;
                    } else {
                        console.log("Kritischer Fehler!")
                    }

                    console.log("nicknameobj: " + nicknameObj.color + ",  nicknameObj.id: " + nicknameObj.id);
                    z++
                }
                playerArray.push(playerObject);
                //Blaue Felder im Overview füllen und gamemaster Spielerliste erstellen
                io.emit('playerList', playerObject, playerArray);
            }
        });


//schnellster Buzzer wird ermittelt und an die CLients geschickt
        client.on('send_buzz', function (id) {
            playerArray.forEach(function (player) {
                if (player.id === id) {

                    //buzzer = JSON.parse(buzzer);
                    console.log("test2 " + id);
                    console.log('message: ' + x);
                    x += 1;
                    if (x === 1) {
                        erster = player;
                        //client.buzzer = buzzer;
                        console.log('message3: ' + player);
                        console.log('message4: ' + player.nickname);
                        io.emit('fastest player', player);
                        fastestPlayer = player;


                    }
                }else{console.log("ungültiger Mitspieler.");}
            });
        });

        var tdId;
        var indx;
        client.on('showQuestion', function(tdId2) {
            tdId = tdId2;
            console.log("tdId2 vorne: " + tdId2);

            /**Hier anzahl der fragen anpassen**/
            //for (var anzahlDerFragen = 0; anzahlDerFragen < 16; anzahlDerFragen ++) {
            if (tdId.length < 10) {
                indx = tdId2.substring(tdId2.length - 1, tdId2.length);
            } else {
                indx = tdId2.substring(tdId2.length - 2, tdId2.length);
            }

            if (questionArray[indx].erledigt === 0) {
                //Frage als erledigt markieren.

                // if (questionArray[indx].val % 2 === 1) {
                //     socket.emit('showNothing', questionArray, tdId2, indx);
                //     document.getElementById(tdId).innerHTML = "erledigt";
                // } else {
                    if (questionArray[indx].superquestion === 1) {
                        console.log("superquestion");
                        io.emit('showSuperQuestion', questionArray, tdId2, indx);
                        questionArray[indx].erledigt = 1;
                    } else if (questionArray[indx].picture === 1) {
                        console.log("picture");
                        io.emit('showPicture', questionArray, tdId2, indx);
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
                if (fastestPlayer.nickname === player.nickname) {
                    player.pkte += currentQuestionObj.pkte;
                    console.log("schnellster Spieler, this.playerArray: " + playerArray[0].nickname);
                    io.emit('trueAnswer', player, playerArray, answerArray, tdId, indx, questionArray);
                  //  $('#schnellster-text').text("...");
                }
            });
            x = 0;
        });

        client.on('giveUp', function () {

            //var  schnellster2 = document.getElementById("schnellster-text").innerText();
            // socket.emit('showNothing', questionArray, tdId, indx);


            io.emit('giveUp', playerArray, answerArray);
            x = 0;
        });


        client.on('wrongAnswer', function (fastestPlayer ) {
            console.log("in wrongAnswer, playerArray[0].nickname:  " +fastestPlayer.id);
            //schnellster.pkte -= fragenPunkte;
            playerArray.forEach(function (player) {
                if (fastestPlayer.id === player.id) {
                    player.pkte -= currentQuestionObj.pkte;
                    console.log("in wrongAnswer, playerpkte:  " + player.pkte);
                    io.emit('wrongAnswer', player, playerArray);
                }else{
                    alert("irgendwas läuft schief.");
                }
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

    }
)
;


//http.listen(3000, function () {
server.listen(3000, function () {
    console.log('listening on *:3000');
});

