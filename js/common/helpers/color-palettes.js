/**
 * Returns an object containing various color palettes.
 *
 * @return {Object} The color palettes.
 */
const colorPalettes = () => {
	const themeColors = wp.data.select( 'core/block-editor' ).getSettings().colors;
	const defaultColors = wp.blockEditor.SETTINGS_DEFAULTS.colors;
	const niceColors = defaultColors.filter(
		( color ) => ! [ 'black', 'white', 'cyan-bluish-gray' ].find( ( boring ) => boring === color.slug )
	);

	const colorDiff = themeColors.filter(
		( themeColor ) => ! defaultColors.find( ( defaultColor ) => defaultColor.slug === themeColor.slug )
	);

	const hasThemeColorPalette = colorDiff.length ? true : false;

	return {
		themeColors,
		defaultColors,
		niceColors,
		hasThemeColorPalette,
	};
};

export default colorPalettes;
