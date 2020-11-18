const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
// const checkJwt = require('../auth0');

const FullMessage = require('../models/fullMessage');
const Message = require('../models/Message');
const parseMessage = require('../parsers/parseMessage');

// Prod or dev
const URL = 'wss://dmcchat.com:9000';
// const URL = 'ws://localhost:9000';
ws = new WebSocket(URL);

// Check if API is running
router.get('/healthCheck', (req, res) => {
	res.send('API is healthy.');
});

// Get all messages from DB
router.get('/getMessages', async (req, res) => {
	console.log('Getting ALL messages.');
	const posts = await FullMessage.find();
	res.send(posts);
});

// Get last 15 messages from DB
router.get('/getLast15Messages', async (req, res) => {
	console.log('Getting last 15 messages...');
	const posts = await Message.find().sort({ $natural: -1 }).limit(15);
	res.send(posts);
});

// Send message to socket server and write to DB
router.post('/sendMessage', (req, res) => {
	let message = { name: req.headers.name, message: req.headers.message };
	const messagePlain = req.headers.name + ' ' + req.headers.message;
	let nonPlayerMessage = false;

	//send message to websocket server
	var msg = JSON.stringify(message);
	ws.send(msg);

	if (!message.name.startsWith('<')) {
		nonPlayerMessage = true;
	}
	// remove < > from name for DB readability
	const parsedName = req.headers.name.replace(/\W/g, '');

	// mongoose schema for permanent storage
	const post = new FullMessage({
		name: parsedName,
		messages: req.headers.message,
	});

	// mongoose schema for temp storage
	const postPlainMessage = new Message({
		name: req.headers.name,
		message: req.headers.message,
	});

	// res.json({ name: req.headers.name, message: req.headers.message });
	// check if user already exists
	console.log(parseMessage(message));
	FullMessage.findOne({ name: parsedName }, async (err, doc) => {
		if (err) {
			console.log(err);
		} else {
			//if user exists in DB, update user with message
			if (
				!message.name.startsWith('[From') &&
				!message.name.startsWith('[!]')
			) {
				await postPlainMessage.save();
			}
			//if message comes from a player, save
			if (doc && parseMessage(message) && !nonPlayerMessage) {
				FullMessage.updateOne(
					{ name: parsedName },
					{ $push: { messages: req.headers.message } },
					function (err, result) {
						if (err) {
							res.send(err);
						} else {
							res.send({
								response: 'Updating user in DB.',
								name: doc.name,
								message: req.headers.message,
							});
						}
					}
				);

				//message contains logout text or server alert
			} else if (!parseMessage(message) || nonPlayerMessage) {
				try {
					res.send({
						response: 'Message parsed from DB entry.',
					});
				} catch {
					(err) => console.log(err);
				}
			}
			//if user does not exist in DB, add user and message
			else {
				try {
					// await postPlainMessage.save();
					await post.save();
					res.send({
						response: 'Adding new user to DB.',
						name: req.headers.name,
						message: req.headers.message,
					});
				} catch {
					(err) => console.log(err);
				}
			}
		}
	});
});
module.exports = router;
