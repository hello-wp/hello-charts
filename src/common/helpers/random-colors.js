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

	const settings = wp.data.select( 'core/block-editor' ).getSettings();

	// If the theme doesn't have any defined colors, just return black.
	if ( ! settings.hasOwnProperty( 'colors' ) ) {
		return new Array( length ).fill( '#000000' );
	}

	// Remove boring colors, like black & white.
	const themeColors = settings.colors.filter(
		( color ) => ! boringColors.find( ( boring ) => boring === color.slug )
	);

	// Get an array of color values only, without names or slugs.
	let colorValues = themeColors.map( ( color ) => ( color.color ) );

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
