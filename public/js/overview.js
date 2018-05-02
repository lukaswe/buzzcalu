var socket = io(),
    playerArray = [],
    i = 1,
    tdId = 0,
    indx = 0,
    prevTdId = 0,
    imgChunks = [],
    mystorage = localStorage;


$(document).ready(function () {
    console.log(".ready bei .: " + mystorage.getItem('id'));
    if (mystorage.getItem('id') !== null) {
        console.log("reconnection: ", mystorage.getItem('id'));
        socket.emit('reconnectNotPlayerOverview', mystorage.getItem('id'));
    } else {
        console.log("registerOverview");
        socket.emit('registerOverview');

    }
    $("body").toggleClass("question-inactive");
    $("body").toggleClass("answer-inactive");

});


socket.on('emptyLocalstorageOverview', function () {
    localStorage.clear();
    mystorage.clear();
    console.log("id: " + mystorage.getItem('id'));
    console.log("mystorage wird geleert.");
    console.log("registerOverview nach Leerung des local storages");
    socket.emit('registerOverview');

});

socket.on('registerOverview', function (id) {
    console.log('id: ', id);
    mystorage.setItem('id', id);
    console.log("im mystorage registeroverview ist die id: " + mystorage.getItem('id'));
});

// socket.on('emptyLocalstorageOverview', function () {
//     console.log("Localstorage wird gelöscht");
//     mystorage.clear();
// });


socket.on('reconnectNotPlayerOverview', function (playerArray9, questionArray, tdId, indx, validate) {
    if(!validate){
        console.log("fuck");
    }else{
        playerArray = playerArray9
        //Array mit Spielern füllen
        console.log('reconnected & playerarray: ' + playerArray[0]);
        console.log('reconnected & questionarray: ' + questionArray[0]);
        //  mystorage.setItem('playerArrayStorage', JSON.stringify(playerArray));
        console.log("tdId:" + tdId + ", indx:" + indx);
        if (tdId !== null) {
            questionStart2(questionArray, tdId, indx);
        }
        console.log("playerArray.length: " + playerArray.length);
        fillNameFields(playerArray9);}
});


//Clients verbinden sich //Blaue Felder füllemn :)
socket.on('playerList', function (playerObject, playerArray7) {
    //Array mit Spielern füllen
    playerArray = playerArray7;
    console.log(playerObject.nickname + " just connected!");
    var x = 0;
    playerArray.forEach(function (player) {
        mystorage.setItem('playerArrayStorage[x]', JSON.stringify(player));

        console.log("jsonstring: " + mystorage.getItem('playerArrayStorage[x]'));
        x++;
    });


    mystorage.setItem('playerArrayStorage', JSON.stringify(playerArray));
    fillNameFields(playerArray);
    // fillNameFields(playerArray);

});

socket.on('buzzerTest', function (nickname) {

});

socket.on('buzzerKlappt', function (nickname) {
    $('#questionSpaceBoxId').text(nickname + " spielt mit!");
    $("body").toggleClass("question-active");
    console.log("  $(body).toggleClass(question-inactive);");
    $("body").toggleClass("question-inactive");
    fillNameFields(playerArray);


});


socket.on('trueAnswer', function (player, playerArray5, answerArray, tdId, indx, questionArray) {
    var img = document.getElementById('img-stream2');
    playerArray = playerArray5;
    answerStart(answerArray, tdId, indx);
    prevTdId = tdId;
    console.log('prevTdiDi: ' + prevTdId);
    fillNameFields(playerArray);
    $('#erster-text').text("...");
    $('#richtig-text').text("Richtig!");
    $("body").toggleClass("answer-inactive");
    emptyLastQuestionInTable(questionArray);
});


socket.on('giveUp', function (playerArray5, answerArray, tdId, indx, questionArray) {
    playerArray = playerArray5;
    answerStart(answerArray, tdId, indx);
    prevTdId = tdId;
    console.log('prevTdiDi: ' + prevTdId);
    fillNameFields(playerArray);
    $('#erster-text').text("Niemand.");
    $("body").toggleClass("answer-inactive");
    emptyLastQuestionInTable(questionArray);
});


socket.on('wrongAnswer', function (player, playerArray9, tdId, indx) {
    playerArray = playerArray9;
    $('#erster-text').text("...");
    $('#richtig-text').text("Falsch!");
    fillNameFields(playerArray9);

});

socket.on('showTable', function () {
    $('#werDarf').text("...");
    $('#erster-text').text("...");
    showTable();
});

function showTable() {
    $('#richtig-text').text("...");
    $("body").toggleClass("question-active");
    $("body").toggleClass("question-inactive");
    $("body").toggleClass("answer-inactive");
}

socket.on('backToOverview', function (playerArray6) {
    // console.log("Backto");
    playerArray = playerArray6;
    answerStart(answerArray, tdId, indx);
    prevTdId = tdId;
    console.log('prevTdiDi: ' + prevTdId);
    fillNameFields(playerArray);
});

socket.on('fastest player', function (player) {
    $('#erster-text').text(player.nickname);
    playerArray.forEach(function (player2) {
        console.log("player2.nickname" + player2.nickname);
        if (player2.id == player.id) {
            console.log("das geht jetzt mal " + player2.id + " = " + player.id);
        }
    });
});


socket.on('showQuestion', function (questionArray, tdId2, indx2) {
    console.log("tdId2: " + tdId2);

    $('#richtig-text').text("...");
    $('#answer-text').text("...");
    questionStart2(questionArray, tdId2, indx2);
});


socket.on('showSuperQuestion', function (questionArray, tdId2, indx2) {

    que = '#question' + indx2;
    // blink('#question'+indx2);
    console.log("$(que:)" + que);
    blink($(que));

    tdId = tdId2;
    indx = indx2;
    console.log("superQuestion");
    questionStart2(questionArray, tdId, indx);
});

/**BildübertragunG**/
socket.on('showPicture', function (questionArray, tdId2, indx2, chunk) {
    var img = document.getElementById('img-stream2');
    imgChunks.push(chunk);
    console.log("Image loading");
    img.setAttribute('src', 'data:image/jpeg;base64,' + window.btoa(imgChunks));
    console.log("showPicture!!!");
    questionStart2(questionArray, tdId2, indx2);
    //<img src="/pictures/1klasse.jpg" alt="1.Klasse" />
    // window.location.assign('/picturing')
});

socket.on('showNothing', function (questionArray, tdId, indx) {
    console.log("qA: " + questionArray[indx].text + " , " + questionArray[indx].val);
    console.log("this.questionArray.val" + questionArray[indx].val);
    //  questionStart2(questionArray, tdId, indx);
    document.getElementById(tdId).innerHTML = "";

});
socket.on('winner', function (winnerObj) {
    console.log("winner: " + winnerObj.nickname);
    console.log("'#king'+winnerObj.nr: " + '#king'+winnerObj.nr);
    $('#king'+winnerObj.nr).show();

});


/**Antwort in Tabelle eintragen**/
function answerStart(answerArray, tdId, indx) {
    $('#answer-text').text(answerArray[indx]);
}

/** Frage in Tabelle eintragen **/
function questionStart2(questionArray, tdId, indx) {

    $('#werDarf').text(questionArray[indx].wer);
    $('#questionSpaceBoxId').text(questionArray[indx].text);

    $("body").toggleClass("question-active");
    console.log("  $(body).toggleClass(question-inactive);");
    $("body").toggleClass("question-inactive");


}

function emptyLastQuestionInTable(questionArray) {
    /** letztes Fragenfeld leeren**/
    questionArray.forEach(function (question) {
        if (question.erledigt === 1) {
            console.log(question.text + "erledigt mit nummer: " + question.id + 'Diese Frage ist schon beantwortet: ');
            // $('#question' + question.id.text(""));
            document.getElementById('question' + question.id).innerHTML = '';
        }
    });
}


/**Blaue Namensfelder werden befüllt**/
function fillNameFields(playerArray2) {
    i = 0;
    console.log("fillNameFields");
    console.log("playerArray2.length" + playerArray2.length);
    playerArray2.forEach(function (player) {
        $('#player' + i + '-name').text(player.nickname);
        $('#player' + i + '-pkte').text(player.pkte);

        document.getElementById("player" + i + "-name").style = "visibility:visible";
        i += 1;
    });

}



