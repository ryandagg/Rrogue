import {SIGHT, SIGHT_GROUP} from 'app/game/mixins/MixinConstants';

export default {
	name: SIGHT,
	groupName: SIGHT_GROUP,
	init: function({sightRadius}) {
		this.sightRadius = sightRadius || 5;
	},
	getSightRadius: function() {
		return this.sightRadius;
	},
	setSightRadius: function(newRadius) {
		this.sightRadius = newRadius;
	},
};
