/**
 * Chooses a random theme colors.
 *
 * @param {number}	length	The number of random colors to return.
 * @return {Array} The colors.
 */
const randomColors = ( length ) => {
	let colors = [];

	const boringColors = [
		'black',
		'gray',
		'dark-gray',
		'light-gray',
		'white',
	];

	// Retrieve the active color scheme.
	const colorsObject = wp.data.select( 'core/block-editor' ).getSettings().colors;

	// Remove boring colors, like black & white.
	const filteredColors = colorsObject.filter(
		( color ) => ! boringColors.find( ( boring ) => boring === color.slug )
	);

	// Get an array of color values only, without names or slugs.
	let colorValues = filteredColors.map( ( color ) => ( color.color ) );

	// Shuffle the colors.
	colorValues = colorValues.sort( () => Math.random() - 0.5 );

	// Extend the color array to be at least the length we need.
	while ( colors.length < length ) {
		colors.push.apply( colors, colorValues );
	}

	// Trim the color array to be precisely the length we need.
	colors = colors.slice( 0, length );

	return colors;
};

export default randomColors;
