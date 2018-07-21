import Repository from './Repository';
import Item from '../objects/Item';

const ItemRepository = new Repository('items', Item);

ItemRepository.define('apple', {
	name: 'apple',
	character: '%',
	foreground: 'red',
});

ItemRepository.define('rock', {
	name: 'rock',
	character: '*',
	foreground: 'white',
});

export default ItemRepository;
