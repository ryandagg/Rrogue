/* globals document */
import { SPELL_SCREEN } from 'app/components/game-overlay-modal/GameOverlayConstants';
import { KEY_DOWN } from 'app/game/GameConstants';
import { getArrayOfLength } from 'app/utils/ArrayUtils';
import { connect } from 'react-redux';
import { compose, withProps, withState, lifecycle } from 'recompose';
import { withStyles } from '@material-ui/core/styles/index';
import ROT from 'rot-js';
import {setPlayerProps} from 'app/game/GameInterface';
import {closeModal} from 'app/components/game-info/GameActions';

// used by PlayScreen to act as a bridge between rot-js
export const spellScreenTemplate = {
	modalType: SPELL_SCREEN,
	handleInput: (inputType, inputData) => {
		console.log('inputType, inputData: ', inputType, ', ', inputData);
		if (inputType === KEY_DOWN) {
			switch (inputData.keyCode) {
				case ROT.VK_ESCAPE:
				case ROT.VK_ENTER: {

					break;
				}
				default:
					break;
			}
		}
	},
};

const spellsPerRow = 10;
export const TARGET_RUNE_INDEX = 'TARGET_RUNE_INDEX';

const getEmptySpell = (maxRunes) => ({runes: getArrayOfLength(maxRunes)});


export default compose(
	withStyles(theme => ({
		button: {
			margin: theme.spacing.unit,
			fontSize: '8pt',
		},
	})),
	withState('selectedSpellIndex', 'setSelectedSpellIndex'),
	withState('selectedRuneSlotIndex', 'setSelectedRuneSlotIndex'),
	withState('selectedRuneViewIndex', 'setSelectedRuneViewIndex'),
	connect(({gameInfo = {}}) => {
		const {player = {}} = gameInfo;
		const {spells, items} = player;
		return {
			rawSpells: spells,
			runes: items,
			maxRunes: player.sightRadius,
		};
	}, {closeModal}),
	withState('spells', 'setSpells', ({rawSpells, maxRunes}) => rawSpells.map(spell => spell || getEmptySpell(maxRunes))),
	withProps((props) => {
		const {
			spells,
			selectedSpellIndex,
			selectedRuneSlotIndex,
			runes,
			setSpells,
			selectedRuneViewIndex,
			setSelectedRuneSlotIndex,
			setSelectedRuneViewIndex,
			setSelectedSpellIndex,
			closeModal,
		} = props;
		const updateSpell = (properties) => {
			spells[selectedSpellIndex] = {...spells[selectedSpellIndex], ...properties};
			setSpells(spells);
		};

		const selectedSpell = spells[selectedSpellIndex];
		let selectedRune = selectedSpell && selectedRuneSlotIndex ?  selectedSpell.runes[selectedRuneSlotIndex] : undefined;
		if (selectedSpell && selectedRuneSlotIndex === TARGET_RUNE_INDEX) selectedRune = selectedSpell.targetRune;
		const targetingRuneSelected = selectedRuneSlotIndex === TARGET_RUNE_INDEX;


		return {
			selectedSpell,
			selectedRune,
			selectedHoverRune: runes[selectedRuneViewIndex],
			spellRows: spells.reduce((result, spell = {}, index) => {
				if (index % spellsPerRow === 0) {
					result.push([]);
				}
				result[result.length - 1].push({...spell, index});
				return result;
			}, []),
			updateSpell,
			runes: runes.reduce((result, rune, index) => {
				if (!rune) return result;

				let doAdd = false;
				if (targetingRuneSelected && rune.pattern) {
					doAdd = true;
				} else if (!targetingRuneSelected && !rune.pattern) {
					doAdd = true;
				}

				if (doAdd) {
					result.push({...rune, index});
				}

				return result;
			}, []),
			setSpellRune: (rune) => {
				if (targetingRuneSelected) {
					selectedSpell.targetRune = rune;
				} else {
					selectedSpell.setRune(selectedRuneSlotIndex, rune);
				}
				spells[selectedSpellIndex] = selectedSpell;
				setSpells(spells);
			},
			onKeyPress: (keyCode) => {
				switch (keyCode) {
					case ROT.VK_ESCAPE:
					case ROT.VK_ENTER: {
						// save here
						setPlayerProps({spells});
						setSelectedRuneViewIndex(undefined);
						setSelectedRuneSlotIndex(undefined);

						if (selectedSpell) {
							setSelectedSpellIndex(undefined);
						} else {
							closeModal();
						}

						break;
					}
					default:
						break;
				}
			},
		};
	}),
	lifecycle({
		componentDidMount() {
			document.addEventListener('keydown', ({keyCode}) => this.props.onKeyPress(keyCode), false);
		},
		componentWillUnmount() {
			document.removeEventListener('keydown', ({keyCode}) => this.props.onKeyPress(keyCode), false);
		},
	})
);
