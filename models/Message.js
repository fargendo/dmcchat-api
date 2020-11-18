const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
	// _id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: { type: Date, default: Date.now },
})
MessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 })

module.exports = mongoose.model('plain-chat', MessageSchema)
