/**
 * BLOCK: Pie Chart
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
import { icons, randomColors, rgba2hex } from '../../common/helpers';

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
			labels: [ 'A', 'B', 'C', 'D' ],
			datasets: [
				{
					label: __( 'Data Set', 'hello-charts' ),
					data: [ 'generate' ],
					cutout: '0%',
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
					position: 'bottom',
					align: 'center',
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
registerBlockType( 'hello-charts/block-pie', {
	title: __( 'Pie Chart', 'hello-charts' ),
	description: __( 'Use a Pie Chart to plot data in a segmented circle (or doughnut). Pie Charts are excellent for showing the relational proportions of data.', 'hello-charts' ),
	icon: icons.pie,
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ), __( 'doughnut', 'hello-charts' ), __( 'donut', 'hello-charts' ) ],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes,
	example: {
		attributes: {
			title: __( 'Pie Chart', 'hello-charts' ),
			showChartTitle: false,
			height: 280,
			chartData: JSON.stringify( {
				datasets: [
					{
						data: [ 6, 4, 9, 10 ],
						borderColor: [ '#cf2e2e', '#00d084', '#0693e3', '#9b51e0' ],
						backgroundColor: [ '#cf2e2e', '#00d084', '#0693e3', '#9b51e0' ],
					},
				],
			} ),
			chartOptions: JSON.stringify( {
				animation: false,
				responsive: false,
				layout: {
					padding: 0,
				},
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
					'hello-charts/block-line',
					'hello-charts/block-polar-area',
					'hello-charts/block-radar',
				],
				transform: ( from ) => {
					const to = {};
					const toOptions = JSON.parse( attributes.chartOptions.default );
					const fromOptions = JSON.parse( from.chartOptions );
					const fromData = JSON.parse( from.chartData );

					to.title = from.title;
					to.showChartTitle = from.showChartTitle;
					to.showChartBackground = from.showChartBackground;

					toOptions.plugins.legend = fromOptions.plugins.legend;
					to.chartOptions = JSON.stringify( toOptions );

					/*
					 * Some chart types use only a single color per dataset. This chart should
					 * use an array of colors, so we'll randomly generate them.
					 */
					fromData.datasets.forEach( ( dataset ) => {
						const themeColors = randomColors( dataset.data.length - 1 );
						if ( 'string' === typeof dataset.backgroundColor ) {
							dataset.backgroundColor = [
								rgba2hex( dataset.backgroundColor ),
								...themeColors,
							];
						}
						if ( 'string' === typeof dataset.borderColor ) {
							dataset.borderColor = [
								rgba2hex( dataset.borderColor ),
								...themeColors,
							];
						} else if ( 'undefined' === typeof dataset.borderColor ) {
							dataset.borderColor = dataset.backgroundColor;
						}
					} );

					to.chartData = JSON.stringify( fromData );

					return createBlock( 'hello-charts/block-pie', to );
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
