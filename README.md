# BuzzCaLu

BuzzCaLu is in early ALPHA state e.g. early Development.

BuzzCaLu will be an online web-application for playing a quiz-game with several web-enabled devices:

## Devices
Each device has one of the following roles.
### Overview Screen
The Overview Screen is supposed to be visible to every player.

### Game Master Screen
There can be only one device showing the Game Master Screen. The Game Master Screen enables interaction with the system for selecting the next category

### Player's Screen
The Player's Screen only enables each player for easy interaction i.e. Buzzering, when one wants to anser the question.

## Gameplay

### Intro Phase
The game starts on the Overview Screen illustrating the waiting for all players to come in. 
The players can log into the session by entering the game-pin and the (team-)name. The Game-Master can accept or decline incoming new players.
If all players are in, the game master can start the game.

### Overview
The Overview Screen showing the full category table (category/point-value like jeopardy). From that point on, the Players-Screen only shows the buzzer button (firstly disabled). The game master selects a question-category and starts the game. After that, the Overview-Screen shows the Question-text and the Buzzers on the Players-Screen get enabled.
On the first Buzz-Event, the overview screen shows the the name of the fastest player, while the Game Master Screen asks the Master to rate the answer as right or wrong. Possibly the systems gives the game master a sample answer on the Game Master Screen. If nobody can answer the question, the Game Master can skip the question.

If the Player answered correctly and the Game Master indicates that to the system, the player gets the points added. If not, the points get substracted and the buzzer-round is opened again. As soon as the question is answered correctly, the game moves on to the category tabel and the game master can select the next question.

## Technology
We want to use node.js and socket.io for enabling all devices for real time communication.

Let's go!
Caro & Lukas
