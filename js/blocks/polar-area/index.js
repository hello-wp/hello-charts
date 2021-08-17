/**
 * BLOCK: Polar Area Chart
 */

/**
 * External components.
 */
import tinycolor from 'tinycolor2';

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
	title: {
		type: 'string',
		default: '',
	},
	showChartTitle: {
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
			labels: [ 'A', 'B', 'C', 'D', 'E' ],
			datasets: [
				{
					label: __( 'Data Set', 'hello-charts' ),
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
			showChartBackground: false,
			chartBackgroundColor: '#ffffff',
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
			scales: {
				r: {
					grid: {
						display: true,
					},
					ticks: {
						display: true,
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
registerBlockType( 'hello-charts/block-polar-area', {
	title: __( 'Polar Area Chart', 'hello-charts' ),
	description: __( 'Invented by Florence Nightingale, Polar Area Charts are often used to highlight the scale of values, especially in cyclical data sets.', 'hello-charts' ),
	icon: icons.polarArea,
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ), __( 'coxcomb', 'hello-charts' ), __( 'rose', 'hello-charts' ) ],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes,
	example: {
		attributes: {
			title: __( 'Polar Area Chart', 'hello-charts' ),
			showChartTitle: false,
			height: 280,
			chartData: JSON.stringify( {
				labels: [ 'A', 'B', 'C', 'D', 'E', 'F' ],
				datasets: [
					{
						data: [ 7, 5, 6, 4, 6 ],
						borderColor: [ '#cf2e2e', '#00d084', '#0693e3', '#9b51e0', '#fcb900' ],
						borderWidth: 3,
						backgroundColor: [
							'rgba(207, 46, 46, 0.6)',
							'rgba(0, 208, 132, 0.6)',
							'rgba(6, 147, 227, 0.6)',
							'rgba(155, 81, 224, 0.6)',
							'rgba(252, 185, 0, 0.6)',
						],
					},
				],
			} ),
			chartOptions: JSON.stringify( {
				animation: false,
				showChartBackground: false,
				chartBackgroundColor: '#ffffff',
				responsive: false,
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						display: false,
					},
				},
				scales: {
					r: {
						grid: {
							display: true,
						},
						ticks: {
							display: false,
						},
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
					'hello-charts/block-pie',
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
					toOptions.showChartBackground = fromOptions.showChartBackground;
					toOptions.chartBackgroundColor = fromOptions.chartBackgroundColor;
					toOptions.scales.r.grid.display = fromOptions.scales?.r?.grid?.display ?? true;
					toOptions.scales.r.ticks.display = fromOptions.scales?.r?.ticks?.display ?? true;

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

					return createBlock( 'hello-charts/block-polar-area', to );
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
