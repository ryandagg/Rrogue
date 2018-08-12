import React from 'react';
import Modal from 'react-modal';

const GameOverlay = ({children, modalIsOpen, afterOpenModal, closeModal, overlayStyle = {}}) => {
	return (
		<Modal
			ariaHideApp={false}
			isOpen={modalIsOpen}
			onAfterOpen={afterOpenModal}
			onRequestClose={closeModal}
			style={{overlay: {fontWeight: 'bold', color: 'black', ...overlayStyle}}}
			shouldCloseOnEsc={true}
			contentLabel="Example Modal"
		>
			{children}
		</Modal>
	);
};

GameOverlay.displayName = 'GameOverlay';

export default GameOverlay;
