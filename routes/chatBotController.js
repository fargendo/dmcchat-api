const express = require('express')
const router = express.Router()
const VoteCounter = require('../models/voteCounter')
const FullMessage = require('../models/fullMessage')
const Message = require('../models/Message')

router.get('/getPlayerMessages', async (req, res) => {
	console.log('Getting all messages from ' + req.headers.name)
	const posts = await FullMessage.find({ name: req.headers.name })
	res.send(posts)
})

router.get('/getVoteCount', async (req, res) => {
	console.log('Getting vote count for ' + req.headers.name)
	const posts = await VoteCounter.find({ name: req.headers.name })
	res.send(posts)
})

router.post('/addVote', async (req, res) => {
	console.log('Updating vote counter')

	const name = req.headers.name.replace(/\W/g, '')
	const quantity = req.headers.quantity
	const post = new VoteCounter({
		name: name,
		voteCount: 1,
	})

	VoteCounter.findOne({ name: name }, async (err, doc) => {
		if (err) {
			console.log(err)
		} else {
			if (doc) {
				VoteCounter.updateOne({ name: name }, { $inc: { voteCount: quantity } }, function (
					err,
					result
				) {
					if (err) {
						res.send(err)
					} else {
						res.send({
							response: 'Updating user in DB',
							name: req.headers.name,
						})
					}
				})
			} else {
				try {
					await post.save()
					res.send({
						response: 'Adding user to VOTE DB',
						name: req.headers.name,
					})
				} catch (err) {
					console.log(err)
				}
			}
		}
	})
})

router.post('/addRepeatedVote', async (req, res) => {
	console.log('Updating repeated vote counter')
	const name = req.headers.name.replace(/\W/g, '')
	const quantity = req.headers.quantity
	const post = new VoteCounter({
		name: name,
		repeatedVoteCount: 1,
	})

	VoteCounter.findOne({ name: name }, async (err, doc) => {
		if (err) {
			console.log(err)
		} else {
			if (doc) {
				VoteCounter.updateOne({ name: name }, { $inc: { repeatedVoteCount: quantity } }, function (
					err,
					result
				) {
					if (err) {
						res.send(err)
					} else {
						res.send({
							response: 'Updating user in DB',
							name: req.headers.name,
						})
					}
				})
			} else {
				try {
					await post.save()
					res.send({
						response: 'Adding user to REPEATVOTE DB',
						name: req.headers.name,
					})
				} catch (err) {
					console.log(err)
				}
			}
		}
	})
})

module.exports = router
