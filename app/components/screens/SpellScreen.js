import React from 'react';
import {SPELL_SCREEN} from 'app/components/game-overlay-modal/GameOverlayConstants';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import GameOverlay from 'app/components/game-overlay-modal/GameOverlay.js';

// used by PlayScreen to act as a bridge between rot-js
export const spellScreenTemplate = {
	modalType: SPELL_SCREEN,
	handleInput: (inputType, inputData) => {
		console.log('inputType, inputData: ', inputType, ', ', inputData);
	},
};

const SpellScreen = ({}) => {
	return (
		<GameOverlay modalIsOpen={true}>
			<div>a</div>
		</GameOverlay>
	);
};

SpellScreen.displayName = 'SpellScreen';

export default compose(
	connect((/*{gameInfo}*/) => {
		return {
		};
	}),
)(SpellScreen);

