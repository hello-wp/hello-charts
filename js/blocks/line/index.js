/**
 * BLOCK: Line Chart
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
	title: {
		type: 'string',
		default: '',
	},
	showChartTitle: {
		type: 'boolean',
		default: true,
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
			labels: [ '1', '2', '3', '4', '5', '6' ],
			datasets: [
				{
					label: 'A',
					fill: true,
					pointRadius: 3,
					hoverRadius: 3,
					borderWidth: 3,
					pointBorderWidth: 0,
					lineTension: 0.4,
					pointStyle: 'circle',
					data: [ 'generate' ],
				},
				{
					label: 'B',
					fill: true,
					pointRadius: 3,
					hoverRadius: 3,
					borderWidth: 3,
					pointBorderWidth: 0,
					lineTension: 0.4,
					pointStyle: 'circle',
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
			plugins: {
				legend: {
					display: true,
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
registerBlockType( 'hello-charts/block-line', {
	title: __( 'Line Chart', 'hello-charts' ),
	description: __( 'Use a Line Chart to plot data points along a line. Line Charts are useful for showing trend data, or comparing data sets.', 'hello-charts' ),
	icon: icons.line,
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ) ],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes,
	example: {
		attributes: {
			title: __( 'Line Chart', 'hello-charts' ),
			showChartTitle: false,
			backgroundColor: '',
			height: 280,
			width: 450,
			chartData: JSON.stringify( {
				labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ],
				datasets: [
					{
						label: 'A',
						fill: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 10, 19, 6, 3, 12, 15 ],
						borderColor: '#cf2e2e',
						borderWidth: 3,
						pointBackgroundColor: '#cf2e2e',
						backgroundColor: 'rgba(207, 46, 46, 0)',
					},
					{
						label: 'B',
						fill: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 15, 13, 3, 11, 1, 10 ],
						borderColor: '#0693e3',
						borderWidth: 3,
						pointBackgroundColor: '#0693e3',
						backgroundColor: 'rgba(6, 147, 227, 0)',
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
					'hello-charts/block-bar',
					'hello-charts/block-pie',
					'hello-charts/block-polar-area',
					'hello-charts/block-radar',
				],
				transform: ( from ) => {
					const to = {};
					const toOptions = JSON.parse( attributes.chartOptions.default );
					const toData = JSON.parse( attributes.chartData.default );
					const fromOptions = JSON.parse( from.chartOptions );
					const fromData = JSON.parse( from.chartData );

					to.title = from.title;
					to.showChartTitle = from.showChartTitle;
					to.backgroundColor = from.backgroundColor;
					to.autoScale = from.autoScale;

					toOptions.plugins.legend = fromOptions.plugins.legend;
					toOptions.scales.y.stacked = fromOptions.scales?.y?.stacked ?? false;
					toOptions.scales.x.grid.display = fromOptions.scales?.x?.grid?.display ?? true;
					toOptions.scales.y.grid.display = fromOptions.scales?.y?.grid?.display ?? true;
					toOptions.scales.x.grid.color = fromOptions.scales?.x?.grid?.color || fromOptions.scales?.r?.grid?.color;
					toOptions.scales.y.grid.color = fromOptions.scales?.y?.grid?.color || fromOptions.scales?.r?.grid?.color;

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
						dataset.borderWidth = dataset.borderWidth ?? toData.datasets[ 0 ].borderWidth;
						dataset.pointRadius = dataset.pointRadius ?? toData.datasets[ 0 ].pointRadius;
						dataset.pointStyle = dataset.pointStyle ?? toData.datasets[ 0 ].pointStyle;

						if ( toOptions.scales.y.stacked && 0 === index ) {
							dataset.fill = 'start';
						} else if ( toOptions.scales.y.stacked ) {
							dataset.fill = '-1';
						} else {
							dataset.fill = true;
						}

						dataset.lineTension = dataset.lineTension ?? dataset.tension ?? toData.datasets[ 0 ].lineTension;
						delete dataset.tension; // Only keep one version of the similar tension properties.

						if ( 'object' === typeof dataset.backgroundColor ) {
							dataset.backgroundColor = dataset.backgroundColor[ index % dataset.backgroundColor.length ];
						}
						if ( 'object' === typeof dataset.borderColor ) {
							dataset.borderColor = dataset.borderColor[ index % dataset.borderColor.length ];
							dataset.pointBackgroundColor = dataset.borderColor;
						}
					} );

					to.chartData = JSON.stringify( fromData );

					return createBlock( 'hello-charts/block-line', to );
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
