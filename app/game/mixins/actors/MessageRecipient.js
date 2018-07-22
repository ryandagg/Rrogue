import { MESSAGE_RECIPIENT } from 'app/game/mixins/MixinConstants';

export default {
	name: MESSAGE_RECIPIENT,
	init: function(/*template*/) {
		this._messages = [];
	},
	receiveMessage: function(message) {
		this._messages.push(message);
	},
	getMessages: function() {
		return this._messages;
	},
	clearMessages: function() {
		this._messages = [];
	},
};
