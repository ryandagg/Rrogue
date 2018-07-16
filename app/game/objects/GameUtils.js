export const getRandomPositionForCondition = (maxWidth, maxHeight, checker) => {
	// Randomly generate a tile which is a floor
	let x, y;
	do {
		x = Math.floor(Math.random() * maxWidth);
		y = Math.floor(Math.random() * maxHeight);
	} while (!checker(x, y));

	return { x, y };
};

export const getEntityKey = (x, y) => `${x},${y}`;
