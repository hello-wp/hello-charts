/**
 * Returns an object containing default tooltip settings.
 *
 * @return {Object} Various tooltip callback functions.
 */
const tooltip = {
	segmentCallbacks: {
		title: ( context ) => {
			return context[ 0 ].dataset.label;
		},
	},
};

export default tooltip;
