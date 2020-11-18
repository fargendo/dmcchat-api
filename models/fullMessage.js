const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	// _id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
	},
	messages: [String],
});

module.exports = mongoose.model('dmc-chat', PostSchema);
