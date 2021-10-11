/**
 * Returns an object containing default legend settings.
 *
 * @return {Object} Various legend callback functions.
 */
const legend = {
	segmentLabels: {
		generateLabels: ( chart ) => {
			const items = [];

			chart.data.labels.forEach( ( label, index ) => {
				const meta = chart.getDatasetMeta( 0 );
				const style = meta.controller.getStyle( index, false );
				items[ index ] = {
					text: label,
					datasetIndex: index,
					fillStyle: style.backgroundColor,
					hidden: ! chart.getDataVisibility( index ),
					lineWidth: style.borderWidth <= 4 ? style.borderWidth : 4,
					strokeStyle: style.borderColor,
					pointStyle: style.pointStyle,
				};
			} );

			return items;
		},
	},
	labels: {
		generateLabels: ( chart ) => {
			const items = [];

			chart.data.datasets.forEach( ( dataset, index ) => {
				items[ index ] = {
					text: dataset.label,
					datasetIndex: index,
					fillStyle: dataset.backgroundColor,
					hidden: ! chart.isDatasetVisible( index ),
					lineWidth: dataset.borderWidth <= 4 ? dataset.borderWidth : 4,
					strokeStyle: dataset.borderColor,
					pointStyle: dataset.pointStyle,
				};
			} );

			return items;
		},
	},
	segmentClick: ( event, item, options ) => {
		const index = options.legendItems.indexOf( item );
		options.chart.toggleDataVisibility( index );
		options.chart.update();
	},
};

export default legend;
