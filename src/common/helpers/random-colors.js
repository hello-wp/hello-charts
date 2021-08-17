/**
 * Chooses a random theme colors.
 *
 * @param {number}	length	The number of random colors to return.
 * @return {Array} The colors.
 */
const randomColors = ( length ) => {
	const useThemeColors = wp.data.select( 'core/block-editor' )?.getSelectedBlock()?.attributes?.useThemeColors ?? false;

	let colors = [];

	// Retrieve the default Gutenberg color scheme.
	let colorsObject = wp.blockEditor.SETTINGS_DEFAULTS.colors;

	// Retrieve the active color scheme.
	if ( useThemeColors ) {
		colorsObject = wp.data.select( 'core/block-editor' ).getSettings().colors;
	}

	const boringColors = [
		'black',
		'cyan-bluish-gray',
		'dark-gray',
		'gray',
		'light-gray',
		'medium-gray',
		'white',
	];

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
