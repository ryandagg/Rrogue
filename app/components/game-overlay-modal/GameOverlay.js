import React from 'react';
import Modal from 'react-modal';
import customStyles from './GameOverlay.scss';
import {connect} from 'react-redux';
import {compose} from 'recompose';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

const GameOverlay = ({modalIsOpen, afterOpenModal, closeModal, setRef}) => {
	return (
		<Modal
			isOpen={modalIsOpen}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<h2 ref={setRef}>Hello</h2>
			<button onClick={closeModal}>close</button>
			<div>I am a modal</div>
			<table>
				<tr><td>a</td></tr>
			</table>
		</Modal>
	);
};

GameOverlay.displayName = 'GameOverlay';

export default GameOverlay;
