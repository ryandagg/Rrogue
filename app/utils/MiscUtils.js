/* globals crypto */

// stolen from: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
export const getUuid = () =>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(
	/[018]/g,
	c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) // eslint-disable-line no-bitwise
);
