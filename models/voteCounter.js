const mongoose = require('mongoose')

const voteCounterSchema = new mongoose.Schema({
	// _id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
	},
	voteCount: Number,
	repeatedVoteCount: Number,
})

module.exports = mongoose.model('vote-count', voteCounterSchema)
