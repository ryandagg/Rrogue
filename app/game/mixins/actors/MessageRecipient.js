import { MESSAGE_RECIPIENT } from 'app/game/mixins/MixinConstants';

export default {
	name: MESSAGE_RECIPIENT,
	init: function(/*template*/) {
		this._messages = [];
	},
	receiveMessage: function(message) {
		// last on top, because I don't want the overhead of always scrolling div to bottom in React
		this._messages.unshift(message);
	},
	getMessages: function() {
		return this._messages;
	},
	clearMessages: function() {
		this._messages = [];
	},
};
