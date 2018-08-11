import Repository from './Repository';


/**
 *
 * ALL PATTERNS MUST ALL HAVE:  width === height && width % 2 === 1
 * so that we can do matrix transposition on them for orienting asymmetric patterns
 *
 * */
// used to make designing patterns easier
const X = true;
const _ = false;

// used in chrome dev terminal to copy and paste for a base
const squareGenerator = (d) => {
	let result = '[\n';
	for (let x = 0; x < d; x++) {
		let row = '[';

		for (let y = 0; y < d; y++) {
			row += `_${y === d - 1 ? '': ', '}`;
		}
		result += '\t' + row + '],\n';
	}
	result += ']';
	return result;
};


export const SINGLE = 'SINGLE';
export const DIAMOND_2_EMPTY_SELF = 'DIAMOND_2_EMPTY_SELF';

const PatternRepository = new Repository('runeTargetPatterns', {}.constructor);


const checkPattern = (name, pattern) => {
	const yLength = pattern[0].length;
	// make sure width & height have a center.
	if (yLength % 2 !== 1) throw new Error(`ya fucked up runeTargetPattern y length: ${name}`);
	if (pattern.length % 2 !== 1) throw new Error(`ya fucked up runeTargetPattern x length: ${name}`);
	if (pattern.length !== yLength) throw new Error(`ya fucked up runeTargetPattern is not square: ${name}`);

	// make sure all rows are the same length
	pattern.forEach(row => {
		if (row.length !== yLength) throw new Error(`ya fucked up runeTargetPattern: ${name}`);
	});

	return true;
};

const addPattern = (name, pattern, range) => {
	checkPattern(name, pattern);
	PatternRepository.define({
		name: `self-${name}`,
		pattern: pattern,
		range,
	});
};

const addSelfAndRanged = (name, pattern, range) => {
	checkPattern(name, pattern);

	PatternRepository.define({
		name,
		pattern: pattern,
		range: range != null ? range : Infinity,
	});

	PatternRepository.define({
		name: `self-${name}`,
		pattern: pattern,
		range: 0,
	});
};

addSelfAndRanged(SINGLE, [
	[X],
]);

const diamondR1 = [
	[_, X, _],
	[X, X, X],
	[_, X, _],
];

addSelfAndRanged('diamond-1', diamondR1);

const diamondR2 = [
	[_, _, X, _, _],
	[_, X, X, X, _],
	[X, X, X, X, X],
	[_, X, X, X, _],
	[_, _, X, _, _],
];

addSelfAndRanged('diamond-2', diamondR2);

const diamond2EmptySelf = [
	[_, _, X, _, _],
	[_, X, X, X, _],
	[X, X, _, X, X],
	[_, X, X, X, _],
	[_, _, X, _, _],
];

addSelfAndRanged(DIAMOND_2_EMPTY_SELF, diamond2EmptySelf);

const squareR1 = [
	[X, X, X],
	[X, _, X],
	[X, X, X],
];

addSelfAndRanged('square-1', squareR1);

const breathCone2 = [
	[_, _, _, _, _],
	[_, _, _, _, X],
	[_, _, _, X, X],
	[_, _, _, _, X],
	[_, _, _, _, _],
];

addPattern('breath-cone-2', breathCone2, 0);

const breathCone3 = [
	[_, _, _, _, _, _, _],
	[_, _, _, _, _, _, X],
	[_, _, _, _, _, X, X],
	[_, _, _, _, X, X, X],
	[_, _, _, _, _, X, X],
	[_, _, _, _, _, _, X],
	[_, _, _, _, _, _, _],
];

addPattern('breath-cone-3', breathCone3, 0);


export default PatternRepository;

