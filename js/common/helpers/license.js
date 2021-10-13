/**
 * License related helper functions.
 *
 * @return {Object} Various license functions.
 */
const license = {
	isAllowedBlock: ( blockSlug ) => {
		if ( ! window.hasOwnProperty( 'helloChartsAllowedBlockTypes' ) ) {
			return false;
		}
		return window.helloChartsAllowedBlockTypes.indexOf( blockSlug ) !== -1;
	},
};

export default license;
