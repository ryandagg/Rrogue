import Repository from './Repository';
import Item from '../objects/Item';

const ItemRepository = new Repository('items', Item);

ItemRepository.define({
	name: 'apple',
	character: '%',
	foreground: 'red',
});

ItemRepository.define({
	name: 'rock',
	character: '*',
	foreground: 'white',
});

export default ItemRepository;
