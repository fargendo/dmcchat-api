const express = require('express');
const fetch = require('node-fetch');
var cors = require('cors');

const jwtCheck = require('./auth0');

// const botChat = require('./bot/botChat');
// botChat();

const messagesController = require('./routes/messagesController');
const chatBotController = require('./routes/chatBotController');
// const tokenController = require('./routes/tokenController');

const app = express();

// app.use(jwtCheck);
app.use(cors());
app.use('/bot', chatBotController);
app.use('/api', messagesController);

// app.use('/token', tokenController);

app.get('/', (req, res) => {
	res.send('Server is running.');
});

// Poll hyper's json for players and world info
var requestLoop = setInterval(function () {
	fetch('https://destroymc.net/status')
		.then((response) => response.json())
		.then((data) => {
			ws.send(JSON.stringify(data));
		})
		.catch((err) => console.log(err));
}, 30000);

module.exports = app;
