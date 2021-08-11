/**
 * Assigns random values to a given data set.
 *
 * @param {number}	length	The length of the random data.
 * @param {number}	min		The lowest possible value in the random data.
 * @param {number}	max		The highest possible value in the random data.
 * @return {Object} The randomized data.
 */
const randomValues = ( length = 6, min = 0, max = 20 ) => {
	return [ ...Array( length ) ].map( () =>
		Math.ceil( ( Math.random() * ( max - min ) ) + min )
	);
};

export default randomValues;
