/**
 * Chooses a random theme color.
 *
 * @return {Object} The color.
 */
const randomColor = () => {
	const boringColors = [
		'black',
		'gray',
		'dark-gray',
		'light-gray',
		'white',
	];

	const settings = wp.data.select( 'core/block-editor' ).getSettings();

	if ( settings.hasOwnProperty( 'colors' ) ) {
		// Remove boring colors, like black & white.
		const themeColors = settings.colors.filter(
			( color ) =>
				! boringColors.find(
					( boring ) => boring === color.slug
				)
		);

		// Choose a random color.
		return themeColors[
			Math.floor( Math.random() * themeColors.length )
		].color;
	}

	return '#000000';
};

export default randomColor;
