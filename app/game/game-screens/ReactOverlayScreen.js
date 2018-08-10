import {setModalType} from 'app/components/game-info/GameActions';
import {dispatch} from 'app/game/ReduxUtils';

// this is a silly wrapper to shut down ROT canvas keyboard handling and to open the modal.

export default ({handleInput, modalType}) => ({
	setup: () => {
		dispatch(setModalType(modalType));
	},
	render: () => {},
	handleInput,
});

