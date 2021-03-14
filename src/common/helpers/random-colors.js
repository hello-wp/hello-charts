import { hex2rgba } from '.';

/**
 * Assigns random colors to a range of Chart.js properties in a given dataset.
 *
 * @param {Object} datasets The data that needs some color.
 * @return {Object} The colorised data.
 */
const randomColors = ( datasets ) => {
	const boringColors = [
		'black',
		'gray',
		'dark-gray',
		'light-gray',
		'white',
	];

	const settings = wp.data.select( 'core/block-editor' ).getSettings();

	datasets.forEach( ( dataset, index ) => {
		if ( 'generate' === dataset.data[ 0 ] ) {
			datasets[ index ].data = [];
			datasets[ index ].data = [ ...Array( 6 ) ].map( () =>
				Math.ceil( Math.random() * 20 )
			);
		}
		if ( settings.hasOwnProperty( 'colors' ) ) {
			if ( ! dataset.hasOwnProperty( 'borderColor' ) ) {
				// Remove boring colors, like black & white.
				const themeColors = settings.colors.filter(
					( color ) =>
						! boringColors.find(
							( boring ) => boring === color.slug
						)
				);
				// Choose a random color.
				const color =
					themeColors[
						Math.floor( Math.random() * themeColors.length )
					].color;
				datasets[ index ].borderColor = color;
				datasets[ index ].pointBackgroundColor = color;
				datasets[ index ].backgroundColor = hex2rgba( color, 0.6 );
			}
		}
	} );

	return datasets;
};

export default randomColors;
