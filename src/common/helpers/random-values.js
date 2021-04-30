/**
 * Assigns random values to a given dataset.
 *
 * @param {number} length The length of the random data.
 * @return {Object} The randomized data.
 */
const randomValues = ( length = 6 ) => {
	return [ ...Array( length ) ].map( () =>
		Math.ceil( Math.random() * 20 )
	);
};

export default randomValues;
