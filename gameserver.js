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

var answerArray = [
        //100
        "Nein",
        "Damit sie sich von den Kellnern unterscheiden",
        "Paris", // Christian Frage
        "James Bond",
        "Zwei",

        //200
        "Schokolade",
        "Peter Lustig",
        "durch Feuchtigkeit", // Christian Frage
        "Der Mann ist gar nicht dick, sondern nur groß. - Der Ukrainer \"Leonid Stadnik\" ist mit 2,53 Meter Körpergröße und Schuhgröße 64 wahrscheinlich größte Mensch der Welt.",
        "Hamburg",

        //300
        "Flohzirkus",
        "Die meiste radioaktive Strahlung stammt aus der Erde und war schon immer da. Der Weltraum ist die zweitstärkste Strahlungsquelle.",
        "2", // Christian Frage
        "Man bekam Wasser, und zwar Weihwasser.",
        "Sie ist gar kein Mensch.Die 13-jährige  Feili  ist eine Schimpansen-Dame im Zoo von Zhengzhou (in Zentralchina). Sie ist mittlerweile Nikotin-abhängig, weil Sie ständig Zoobesucher um Zigaretten anbettelt. Das meldete die Nachrichtenagentur \"China News Service\".",

        //400
        "1860 München",
        "Auf Friedhöfen gab es ein Jahr-2000-Problem. Auf vielen Friedhöfen war es üblich, dass bei Doppelgräbern immer auch gleich der Name und die ersten beiden Ziffern (\"19\") des Sterbejahres vom noch lebenden Partner in den Grabstein eingemeiselt wurden, doch einige davon haben den Jahrtausendwechsel überlebt, und die hatten dann ein falsches Datum auf Ihrem späteren Grabstein.",
        "Er griff versehentlich neben den Hörer. Ken Charles Barger, 47, aus North Carolina schoss sich versehentlich in den Kopf, als er, durch einen nächtlichen Anruf geweckt, statt nach dem Telefon nach seiner 38.er Smith & Wesson griff.", // Christian Frage
        "Ein Pferd hat eine Höchstleistung von über 10 PS. Kurzfristig kann ein Pferd ungefähr 12 PS leisten. Die Dauerleistung liegt allerdings bei etwa einem PS.",
        "Es sind mehr als 5000 € pro Einwohner! Es sind sogar sehr viel mehr!",
        //500
        "3,1 Kilometer",
        "Herr Hutzel",
        "20",
        "Kochen",
        "1 Paar",
    ],

    questionArray = [
        {
            "id": 0,
            "text": "Sind Conny und Christian auf die gleiche Konfession getauft?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 1,
            "erledigt": 0
        },
        {
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
            "text": "Wie lautet die Hauptstadt von Frankreich?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id": 3,
            "text": "Welcher Agent steht im Zusammenhang mit der \"Lizenz zum Töten\"",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!--Schätzfrage-->
            "id": 4,
            "text": "Wie viele Flügel haben Fliegen?",
            "pkte": 100,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },

        {
            "id": 5,
            "text": "Welches der unten genannten Lebensmittel enthält am meisten Eisen? - Rindfleich, -Spinar, -Schokolade",
            "pkte": 200,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Conny Frage -->
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
            "text": "Wodurch \"trocknet\" Sekundenkleber?",
            "pkte": 200, "val": 0, "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id": 8,
            "text": "Warum macht ein Ukrainer namens \"Leonid Stadnik\" keine Diät, obwohl er 210 kg wiegt?",
            "pkte": 200,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!--Schätzfrage-->
            "id": 9,
            "text": "In welcher europäischen Stadt gibt es die meisten Brücken?",
            "pkte": 200,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },

        {
            "id": 10,
            "text": "Was hat das Münchener Oktoberfest im Gegensatz zu anderen Volksfesten zu bieten?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Conny Frage -->
            "id": 11,
            "text": "Wovon bekommen wir die meiste radioaktive Strahlung ab?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Christian Frage -->
            "id": 12,
            "text": "Wie viele der hier anwesenden Hochzeitsgäste waren bereits mit Christian zusammen in der 1. Klasse?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 1,
            "erledigt": 0
        },
        {
            "id": 13,
            "text": "Was bekam man beim weltweit ersten Münzautomat für sein Geld?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },


        {
            <!--Schätzfrage-->
            "id": 14,
            "text": "Warum berichteten im August 2004 weltweit einige Zeitungen darüber, dass eine 13-jährige in China raucht und Passanten um Zigaretten anbettelt?",
            "pkte": 300,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },

        {
            "id": 15,
            "text": "Papst Franziskus ist Ehrenmitglied des Fußballvereins ...?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Conny Frage -->
            "id": 16,
            "text": "1999 sprach man vom Jahr-2000-Problem. Man befürchtete, dass zum Jahrtausendwechsel sämtliche Computer verrückt spielen. Tatsächlich gab es aber ein ganz anderes Jahr-2000-Problem, aber wo?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Christian Frage -->
            "id": 17,
            "text": "Am 21. Dezember 1992 kam ein Mann aus North Carolina auf mysteriöse Weise ums Leben nachdem sein Telefon klingelte. Was war passiert?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id": 18,
            "text": "Wie hoch ist die Höchstleistung eines durchschnittlichen Pferdes in PS?",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!--Schätzfrage-->
            "id": 19,
            "text": "Seit der deutschen Wiedervereinigung sind gigantische Beträge von West- nach Ostdeutschland geflossen, aber wieviel ist das, wenn man den gesamten Betrag durch die Einwohnerzahl Westdeutschlands teilt? Wieviel hat also quasi jeder einzelne Westdeutsche (bis 2013) in die neuen Bundesländer gezahlt??",
            "pkte": 400,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id": 20,
            "text": "Sind Conny und Christian auf die gleiche Konfession getauft?",
            "pkte": 500,
            "val": 0,
            "superquestion": 0,
            "picture": 1,
            "erledigt": 0
        },
        {
            "id": 21,
            "text": "Warum tragen die Herren auf dem Wiener Opernball weiße Fliegen?",
            "pkte": 500,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!-- Christian Frage -->
            "id": 22,
            "text": "Wie lautet die Hauptstadt von Frankreich?",
            "pkte": 500,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            "id": 23,
            "text": "Welcher Agent steht im Zusammenhang mit der \"Lizenz zum Töten\"",
            "pkte": 500,
            "val": 0,
            "superquestion": 0,
            "picture": 0,
            "erledigt": 0
        },
        {
            <!--Schätzfrage-->
            "id": 24,
            "text": "Wie viele Flügel haben Fliegen?",
            "pkte": 500,
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
            console.log("reconnectNotPlayer");
            console.log("reconnectNotPlayer id: " + id);
            console.log("clientArray.length: " + overviewArray.length);
            if (overviewArray.length > 0) {
                overviewArray.forEach(function (clientid) {
                    console.log('client.id: ' + clientid);
                    if (clientid == id) {
                        console.log('reconnectNotPlayerOverview ist im array');
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
                playerObject = ({"id": id, 'nickname': nickname, "pkte": 0, "gameColor": "white"});
                console.log("z: " + z);

                while (z < (playerArray.length + 1)) {

                    if (z == 0) {
                        playerObject.color = "green";
                        z++;
                        break;
                        //nicknameObj.id = z;
                    } else if (z == 1) {
                        playerObject.color = "red";
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z == 2) {
                        playerObject.color = "blue";
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z == 3) {
                        playerObject.color = "yellow";
                        // nicknameObj.id = z;
                        z++;
                        break;
                    } else if (z == 4) {
                        playerObject.color = "purple";
                        //  nicknameObj.id = z;
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
        client.on('send_buzz', function (id) {
            var boo = false;
            console.log("x: " + x);
            x += 1;
            console.log("x1: " + x);
            if (x == 1) {
                playerArray.forEach(function (player) {

                   // while (boo = false) {
                        console.log("player.id in sendbuzz: " + player.id);
                        console.log("id: " + id);
                        if (player.id == id) {

                            //buzzer = JSON.parse(buzzer);
                            console.log("test2 " + id);
                            console.log("player.id in sendbuzz test3: " + player.id);
                            console.log('message: ' + x);

                            erster = player;
                            //client.buzzer = buzzer;
                            console.log('message3: ' + player);
                            console.log('message4: ' + player.nickname);
                            io.emit('fastest player', player);
                            fastestPlayer = player;
//                            boo = true;

                        }
                        else {
  //                          console.log("ungültiger Mitspieler.");
                        }
                  //  }
                });
            }
        });


        /*
        //schnellster Buzzer wird ermittelt und an die CLients geschickt
                client.on('send_buzz', function (id) {
                    var boo = false;
                    playerArray.forEach(function (player) {

                        while (boo = false) {
                            console.log("player.id: " + player.id);
                            console.log("id: " + id);
                            if (player.id == id) {

                                //buzzer = JSON.parse(buzzer);
                                console.log("test2 " + id);
                                console.log('message: ' + x);
                                x += 1;
                                if (x == 1) {
                                    erster = player;
                                    //client.buzzer = buzzer;
                                    console.log('message3: ' + player);
                                    console.log('message4: ' + player.nickname);
                                    io.emit('fastest player', player);
                                    fastestPlayer = player;
                                    boo = true;

                                }
                            } else {
                                console.log("ungültiger Mitspieler.");
                            }
                        }
                    });
                });
        */

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

            //var  schnellster2 = document.getElementById("schnellster-text").innerText();
            // socket.emit('showNothing', questionArray, tdId, indx);


            io.emit('giveUp', player, playerArray, answerArray, tdId, indx);
            x = 0;
        });


        client.on('wrongAnswer', function (fastestPlayer) {
            console.log("in wrongAnswer, playerArray[0].nickname:  " + fastestPlayer.id);
            //schnellster.pkte -= fragenPunkte;
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

    }
)
;


//http.listen(3000, function () {
server.listen(3000, function () {
    console.log('listening on *:3000');
});

