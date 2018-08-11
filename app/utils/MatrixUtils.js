// todo: this name fucking sucks
export const getStartForDiagram = (center, matrix) => {
	const length = matrix.length;
	const halfLength = Math.floor(length/2);
	const xStart = center.x - halfLength;
	const yStart = center.y - halfLength;
	return {x: xStart, y: yStart};
};
