/**
 * BLOCK: Bar Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;

/**
 * Internal dependencies.
 */
import { Edit } from './components';
import { Save } from '../../common/components';
import { icons } from '../../common/helpers';

const attributes = {
	blockId: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '',
	},
	useThemeColors: {
		type: 'boolean',
		default: false,
	},
	height: {
		type: 'number',
	},
	width: {
		type: 'number',
	},
	chartType: {
		type: 'string',
	},
	autoScale: {
		type: 'boolean',
		default: true,
	},
	chartData: {
		type: 'string',
		default: JSON.stringify( {
			init: false,
			labels: [ '1', '2', '3', '4', '5', '6', '7', '8' ],
			datasets: [
				{
					label: 'A',
					data: [ 'generate' ],
				},
			],
		} ),
	},
	chartOptions: {
		type: 'string',
		default: JSON.stringify( {
			init: false,
			animation: false,
			indexAxis: 'x',
			plugins: {
				legend: {
					display: false,
					position: 'top',
					align: 'center',
				},
				tooltip: {
					displayColors: false,
				},
			},
			scales: {
				x: {
					grid: {
						display: true,
					},
					stacked: false,
					ticks: {
					},
				},
				y: {
					grid: {
						display: true,
					},
					stacked: false,
					ticks: {
						autoSkip: false,
						precision: 0,
					},
				},
			},
			layout: {
				padding: 20,
			},
		} ),
	},
};

/**
 * Registers this as a block.
 *
 * @see https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'hello-charts/block-bar', {
	title: __( 'Bar Chart', 'hello-charts' ),
	description: __( 'Use a Bar Chart to display your data in vertical (or horizontal) bars. Bar Charts are great for comparing data sets side by side.', 'hello-charts' ),
	icon: icons.bar,
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ) ],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes,
	example: {
		attributes: {
			backgroundColor: '',
			height: 280,
			width: 450,
			chartData: JSON.stringify( {
				labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ],
				datasets: [
					{
						label: 'A',
						data: [ 10, 19, 6, 3, 12, 15 ],
						borderColor: '#0693e3',
						backgroundColor: 'rgba( 6, 147, 227, 0.8 )',
						borderWidth: [ 3, 3, 3, 3 ],
					},
				],
			} ),
			chartOptions: JSON.stringify( {
				animation: false,
				responsive: false,
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						display: false,
					},
				},
			} ),
		},
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [
					'hello-charts/block-line',
					'hello-charts/block-pie',
					'hello-charts/block-polar-area',
					'hello-charts/block-radar',
				],
				transform: ( from ) => {
					const to = {};
					const fromOptions = JSON.parse( from.chartOptions );
					const toOptions = JSON.parse( attributes.chartOptions.default );
					const fromData = JSON.parse( from.chartData );

					to.backgroundColor = from.backgroundColor;
					to.autoScale = from.autoScale;

					/*
					 * We're intentionally setting the x stacked attribute to the same as y,
					 * because the "Stack Data Sets" option usually only applies to the y axis,
					 * however it should apply to both axes on a bar chart.
					 */
					toOptions.plugins.legend = fromOptions.plugins?.legend;
					toOptions.scales.x.stacked = fromOptions.scales?.y?.stacked ?? false;
					toOptions.scales.y.stacked = fromOptions.scales?.y?.stacked ?? false;
					toOptions.scales.x.grid.display = fromOptions.scales?.x?.grid?.display ?? true;
					toOptions.scales.y.grid.display = fromOptions.scales?.y?.grid?.display ?? true;

					if ( undefined !== fromOptions.scales?.y?.min || undefined !== fromOptions.scales?.r?.min ) {
						const min = fromOptions.scales?.y?.min ?? fromOptions.scales?.r?.min;
						if ( undefined !== min ) {
							toOptions.scales.y.min = min;
						}
					}
					if ( undefined !== fromOptions.scales?.y?.max || undefined !== fromOptions.scales?.r?.max ) {
						const max = fromOptions.scales?.y?.max ?? fromOptions.scales?.r?.max;
						if ( undefined !== max ) {
							toOptions.scales.y.max = max;
						}
					}
					if ( undefined !== fromOptions.scales?.y?.ticks?.stepSize || undefined !== fromOptions.scales?.r?.ticks?.stepSize ) {
						const stepSize = fromOptions.scales?.y?.ticks?.stepSize ?? fromOptions.scales?.r?.ticks?.stepSize;
						if ( undefined !== stepSize ) {
							toOptions.scales.y.ticks.stepSize = stepSize;
						}
					}

					to.chartOptions = JSON.stringify( toOptions );

					/*
					 * Some chart types use an array of colors per dataset. This chart should
					 * only use a single color (the first in the array) for each dataset.
					 */
					fromData.datasets.forEach( ( dataset, index ) => {
						if ( 'object' === typeof dataset.backgroundColor ) {
							dataset.backgroundColor = dataset.backgroundColor[ index % dataset.backgroundColor.length ];
						}
						if ( 'object' === typeof dataset.borderColor ) {
							dataset.borderColor = dataset.borderColor[ index % dataset.backgroundColor.length ];
							dataset.pointBackgroundColor = dataset.borderColor;
						}
					} );

					to.chartData = JSON.stringify( fromData );

					return createBlock( 'hello-charts/block-bar', to );
				},
			},
		],
	},

	/* Render the block components. */
	edit: ( props ) => {
		return <Edit { ...props } />;
	},

	/* Save the block markup. */
	save: ( props ) => {
		return <Save { ...props } />;
	},
} );
