// const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const fs = require('fs');

const app = require('./app');

require('dotenv').config();

// read ssl certificate
const privateKey = fs.readFileSync('ssl-cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('ssl-cert/fullchain.pem', 'utf8');
const credentials = { cert: certificate, key: privateKey };

// Initializes https server
// const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// Set up websocket server on node server
const wss = new WebSocket.Server({ server: httpsServer });
// const wss = new WebSocket.Server({ server: httpServer });
const URL = 'wss://dmcchat.com:9000';
// const URL = 'ws://localhost:9000';
ws = new WebSocket(URL);

// Set up websocket server
wss.on('connection', function connection(ws, req) {
	console.log('User connected to websocket server from: ');
	ws.on('message', function incoming(data) {
		wss.clients.forEach(function each(client) {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	});
});

// Connect to MongoDB
mongoose
	.connect(
		'mongodb+srv://' +
			process.env.DB_USER +
			':' +
			process.env.DB_PASS +
			'@dmc-chat-smcqj.mongodb.net/test?retryWrites=true&w=majority',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(console.log('Connected to DB.'));
('');
httpsServer.listen(process.env.PORT || 9000, () => {
	console.log('HTTPS server is listening on port 9000');
});
// httpServer.listen(process.env.PORT || 9000, () => {
// 	console.log('HTTP server is listening on port 9000');
// });
