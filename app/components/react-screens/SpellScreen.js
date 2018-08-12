import React from 'react';
import {SPELL_SCREEN} from 'app/components/game-overlay-modal/GameOverlayConstants';
import {connect} from 'react-redux';
import {compose, withState, withProps} from 'recompose';
import GameOverlay from 'app/components/game-overlay-modal/GameOverlay.js';
import styles from './SpellScreen.scss';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Spell from 'app/game/objects/Spell';
import { withStyles } from '@material-ui/core/styles';


const spellsPerRow = 10;
const TARGET_RUNE_INDEX = 'TARGET_RUNE_INDEX';
// used by PlayScreen to act as a bridge between rot-js
export const spellScreenTemplate = {
	modalType: SPELL_SCREEN,
	handleInput: (inputType, inputData) => {
		console.log('inputType, inputData: ', inputType, ', ', inputData);
	},
};

const RuneButton = ({name, index, onClick, className, wrapperClassName, onMouseEnter}) => (
	<li className={wrapperClassName}>
		<Button
			variant="outlined"
			size="small"
			onClick={() => onClick(index)}
			color="primary"
			className={className}
			onMouseEnter={onMouseEnter}
		>
			{name || ''}
		</Button>
	</li>
);


const SpellScreen = (props) => {
	const {
		spellRows,
		runes,
		selectedSpell,
		setSelectedSpellIndex,
		classes,
		setSelectedRuneSlotIndex,
		selectedRuneSlotIndex,
		setSelectedRuneViewIndex,
		setSpellRune,
		updateSpell,
		selectedHoverRune,
	} = props;
	return (
		<GameOverlay modalIsOpen={true}>
			<div display-if={!selectedSpell}>
				<div>Select a slot to create/edit a spell</div>
				{spellRows.map((row, rowIndex) => (
					<div key={rowIndex}>
						<ol className={styles.spellRow}>
							{row.map(({name, index} = {}) => (
								<li key={name || index} className={styles.spellBox}>
									<Button
										variant="outlined"
										size="small"
										onClick={() => setSelectedSpellIndex(index)}
										color="primary"
										className={classes.button}
									>
										{name || ''}
									</Button>
								</li>
							))}
						</ol>
					</div>
				))}
			</div>
			<div display-if={selectedSpell}>
				<div className="row">
					<div className="col-md-3">Rune Slots</div>
					<Input
						className="col-md-offset-6 col-md-3"
						onChange={({target}) => updateSpell({name: target.value})}
						defaultValue={selectedSpell.name}
						styles={{float: 'right'}}
					/>
				</div>
				<div className="row">
					<ol className={styles.spellRow}>
						<RuneButton
							onClick={setSelectedRuneSlotIndex}
							index={TARGET_RUNE_INDEX}
							{...selectedSpell.targetRune}
							className={`${classes.button} ${styles.targetRune} ${styles.runeBox}`}
							wrapperClassName={styles.spellBox}
						/>
						{selectedSpell.runes.map((rune = {}, index) => <RuneButton
							key={`${rune.name}-${index}`}
							onClick={setSelectedRuneSlotIndex}
							index={index}
							{...rune}
							className={`${classes.button} ${styles.runeBox}`}
							wrapperClassName={styles.spellBox}

						/>)}
					</ol>
				</div>
				<div display-if={selectedRuneSlotIndex != null}>
					<div className="row">
						<div className="col-xs-3">
							<div>Available Runes</div>
							<ol>
								{runes.map((rune = {}) => (
									<RuneButton
										key={`${rune.name}-${rune.index}`}
										onMouseEnter={() => setSelectedRuneViewIndex(rune.index)}
										onClick={() => setSpellRune(rune)}
										{...rune}
									/>
								))}
							</ol>
						</div>
						<div className="col-xs-9">
							<div>Rune Description</div>
							<div display-if={selectedHoverRune}>
								<div> name: {selectedHoverRune.name} </div>
								<div> power: {selectedHoverRune.power} </div>
								<div> cost: {selectedHoverRune.cost} </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</GameOverlay>
	);
};

SpellScreen.displayName = 'SpellScreen';

export default compose(
	withStyles(theme => ({
		button: {
			margin: theme.spacing.unit,
			fontSize: '8pt',
		},
	})),
	withState('isEditingSpell', 'setIsEditingSpell', false),
	withState('selectedSpellIndex', 'setSelectedSpellIndex'),
	withState('selectedRuneSlotIndex', 'setSelectedRuneSlotIndex'),
	withState('selectedRuneViewIndex', 'setSelectedRuneViewIndex'),
	connect(({gameInfo = {}}) => {
		const {player = {}} = gameInfo;
		const {spells, items} = player;
		return {
			rawSpells: spells,
			runes: items,
		};
	}),
	withState('spells', 'setSpells', ({rawSpells}) => rawSpells),
	withProps(({spells, selectedSpellIndex, selectedRuneSlotIndex, runes, setSpells, selectedRuneViewIndex}) => {
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
					selectedSpell.runes[selectedRuneSlotIndex] = rune;
				}
				setSpells(spells);
			},
		};
	})
)(SpellScreen);

