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
import { hex2rgba, icons, rgba2hex } from '../../common/helpers';

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
	showChartBackground: {
		type: 'boolean',
		default: true,
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
	chartData: {
		type: 'string',
		default: JSON.stringify( {
			init: false,
			labels: [ '1', '2', '3', '4', '5', '6' ],
			datasets: [
				{
					label: 'A',
					fill: false,
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
					fill: false,
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
			height: 280,
			width: 450,
			chartData: JSON.stringify( {
				labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ],
				datasets: [
					{
						label: 'A',
						fill: false,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 10, 19, 6, 3, 12, 15 ],
						borderColor: '#cf2e2e',
						borderWidth: 3,
						pointBackgroundColor: '#cf2e2e',
						backgroundColor: '#cf2e2e',
					},
					{
						label: 'B',
						fill: false,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 15, 13, 3, 11, 1, 10 ],
						borderColor: '#0693e3',
						borderWidth: 3,
						pointBackgroundColor: '#0693e3',
						backgroundColor: '#0693e3',
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
					to.showChartBackground = from.showChartBackground;

					toOptions.plugins.legend = fromOptions.plugins.legend;
					toOptions.scales.y.stacked = fromOptions.scales?.y?.stacked ?? false;
					toOptions.scales.x.grid.display = fromOptions.scales?.x?.grid?.display ?? true;
					toOptions.scales.y.grid.display = fromOptions.scales?.y?.grid?.display ?? true;

					to.chartOptions = JSON.stringify( toOptions );

					/*
					 * Some chart types use an array of colors per dataset. This chart should
					 * only use a single color (the first in the array) for each dataset.
					 */
					fromData.datasets.forEach( ( dataset ) => {
						dataset.fill = dataset.fill ?? toData.datasets[ 0 ].fill;
						dataset.borderWidth = dataset.borderWidth ?? toData.datasets[ 0 ].borderWidth;
						dataset.pointRadius = dataset.pointRadius ?? toData.datasets[ 0 ].pointRadius;
						dataset.pointStyle = dataset.pointStyle ?? toData.datasets[ 0 ].pointStyle;

						dataset.lineTension = dataset.lineTension ?? dataset.tension ?? toData.datasets[ 0 ].lineTension;
						delete dataset.tension; // Only keep one version of the similar tension properties.

						if ( 'object' === typeof dataset.backgroundColor ) {
							dataset.backgroundColor = hex2rgba( dataset.backgroundColor[ 0 ], 0.6 );
						} else {
							dataset.backgroundColor = hex2rgba( dataset.backgroundColor, 0.6 );
						}
						if ( 'object' === typeof dataset.borderColor ) {
							dataset.borderColor = rgba2hex( dataset.borderColor[ 0 ] );
						} else if ( 'undefined' === typeof dataset.borderColor ) {
							dataset.borderColor = rgba2hex( dataset.backgroundColor );
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
