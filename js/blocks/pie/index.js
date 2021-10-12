/**
 * BLOCK: Pie Chart
 */

/**
 * External components.
 */
import tinycolor from 'tinycolor2';
import { get, set } from 'lodash';

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
import { icons, randomColors } from '../../common/helpers';

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
				tooltip: {
					displayColors: false,
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
			backgroundColor: '',
			height: 280,
			chartData: JSON.stringify( {
				datasets: [
					{
						data: [ 6, 4, 9, 10 ],
						borderColor: [ '#cf2e2e', '#00d084', '#0693e3', '#9b51e0' ],
						backgroundColor: [
							'rgba( 207, 46, 46, 0.8 )',
							'rgba( 0, 208, 132, 0.8 )',
							'rgba( 6, 147, 227, 0.8 )',
							'rgba( 155, 81, 224, 0.8 )',
						],
						borderWidth: 3,
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
					'hello-charts/block-line',
					'hello-charts/block-polar-area',
					'hello-charts/block-radar',
				],
				transform: ( from ) => {
					const to = {};
					const toOptions = JSON.parse( attributes.chartOptions.default );
					const fromOptions = JSON.parse( from.chartOptions );
					const fromData = JSON.parse( from.chartData );

					to.backgroundColor = from.backgroundColor;

					set( toOptions, 'plugins.legend', get( fromOptions, 'plugins.legend' ) );

					to.chartOptions = JSON.stringify( toOptions );

					/*
					 * Some chart types use only a single color per dataset. This chart should
					 * use an array of colors, so we'll randomly generate them.
					 */
					fromData.datasets.forEach( ( dataset, index ) => {
						if ( 0 === index ) {
							if ( 'string' === typeof dataset.backgroundColor ) {
								const themeColors = randomColors( dataset.data.length - 1 );
								const alpha = tinycolor( dataset.backgroundColor ).getAlpha();
								dataset.backgroundColor = [
									dataset.backgroundColor,
									...themeColors.map(
										( color ) => tinycolor( color ).setAlpha( alpha ).toRgbString()
									),
								];
							}
						} else {
							dataset.backgroundColor = fromData.datasets[ 0 ].backgroundColor;
						}
						if ( 'string' === typeof dataset.borderColor ) {
							dataset.borderColor = dataset.backgroundColor.map(
								( color ) => tinycolor( color ).toHexString()
							);
							dataset.pointBackgroundColor = dataset.borderColor;
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
