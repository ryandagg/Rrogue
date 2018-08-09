export const getArrayOfLength = length => length ? Array.apply(null, { length }) : [];

export const forEachOfLength = (length, iteratorFunc) =>
	getArrayOfLength(length).forEach((meh, index) => {
		iteratorFunc(index);
	});
