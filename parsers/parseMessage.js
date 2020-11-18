// Filters server messages before saving to DB
const parseMessage = (message) => {
	if (
		message.message.includes('has joined the server.') ||
		message.message.includes('has left the server.') ||
		message.message.startsWith('!') ||
		// message.name.startsWith('[From') ||
		// message.name.startsWith('[!]') ||
		// message.name.startsWith('[Alert]') ||
		message.name.startsWith('<dmcchatbot>')
	) {
		return false;
	} else {
		return true;
	}
};

module.exports = parseMessage;
