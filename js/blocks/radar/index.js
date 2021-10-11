/**
 * BLOCK: Radar Chart
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
			labels: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ],
			datasets: [
				{
					label: __( 'Data Set', 'hello-charts' ),
					fill: true,
					borderWidth: 2,
					pointRadius: 3,
					hoverRadius: 3,
					pointBorderWidth: 0,
					borderDash: [ 0, 0 ],
					borderStyle: 'solid',
					tension: 0,
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
					display: false,
					position: 'top',
					align: 'center',
				},
				tooltip: {
					displayColors: false,
				},
			},
			scales: {
				r: {
					angleLines: {
						display: true,
					},
					pointLabels: {
						display: true,
					},
					grid: {
						display: true,
					},
					ticks: {
						display: true,
						precision: 0,
					},
					suggestedMin: 0,
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
registerBlockType( 'hello-charts/block-radar', {
	title: __( 'Radar Chart', 'hello-charts' ),
	description: __( 'Use a Radar Chart to plot data points in a radial "spider web" pattern. Line Charts are useful for highlighting variations between data sets.', 'hello-charts' ),
	icon: icons.radar,
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ), __( 'web', 'hello-charts' ), __( 'spider', 'hello-charts' ) ],
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes,
	example: {
		attributes: {
			backgroundColor: '',
			height: 280,
			chartData: JSON.stringify( {
				labels: [ 'A', 'B', 'C', 'D', 'E', 'F' ],
				datasets: [
					{
						fill: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						borderDash: [ 0, 0 ],
						borderStyle: 'solid',
						tension: 0,
						pointStyle: 'circle',
						data: [ 5, 19, 14, 15, 6, 15 ],
						borderColor: '#0693e3',
						borderWidth: 3,
						pointBackgroundColor: '#0693e3',
						backgroundColor: 'rgba(6, 147, 227, 0.6)',
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
				scales: {
					r: {
						pointLabels: {
							display: false,
						},
						ticks: {
							display: false,
							precision: 0,
						},
						suggestedMin: 0,
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
					'hello-charts/block-polar-area',
				],
				transform: ( from ) => {
					const to = {};
					const toOptions = JSON.parse( attributes.chartOptions.default );
					const toData = JSON.parse( attributes.chartData.default );
					const fromOptions = JSON.parse( from.chartOptions );
					const fromData = JSON.parse( from.chartData );

					to.backgroundColor = from.backgroundColor;
					to.autoScale = from.autoScale;

					toOptions.plugins.legend = fromOptions.plugins.legend;
					toOptions.scales.r.grid.display = fromOptions.scales?.r?.grid?.display ?? true;
					toOptions.scales.r.ticks.display = fromOptions.scales?.r?.ticks?.display ?? true;

					if ( undefined !== fromOptions.scales?.r?.min || undefined !== fromOptions.scales?.y?.min ) {
						const min = fromOptions.scales?.y?.min ?? fromOptions.scales?.r?.min;
						if ( undefined !== min ) {
							toOptions.scales.r.min = min;
						}
					}
					if ( undefined !== fromOptions.scales?.r?.max || undefined !== fromOptions.scales?.y?.max ) {
						const max = fromOptions.scales?.y?.max ?? fromOptions.scales?.r?.max;
						if ( undefined !== max ) {
							toOptions.scales.r.max = max;
						}
					}
					if ( undefined !== fromOptions.scales?.r?.ticks?.stepSize || undefined !== fromOptions.scales?.y?.ticks?.stepSize ) {
						const stepSize = fromOptions.scales?.y?.ticks?.stepSize ?? fromOptions.scales?.r?.ticks?.stepSize;
						if ( undefined !== stepSize ) {
							toOptions.scales.r.ticks.stepSize = stepSize;
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

						dataset.tension = dataset.tension ?? dataset.lineTension ?? toData.datasets[ 0 ].tension;
						delete dataset.lineTension; // Only keep one version of the similar tension properties.

						if ( 'object' === typeof dataset.backgroundColor ) {
							dataset.backgroundColor = dataset.backgroundColor[ index % dataset.backgroundColor.length ];
						}
						if ( 'object' === typeof dataset.borderColor ) {
							dataset.borderColor = dataset.borderColor[ index % dataset.backgroundColor.length ];
							dataset.pointBackgroundColor = dataset.borderColor;
						}
					} );

					to.chartData = JSON.stringify( fromData );

					return createBlock( 'hello-charts/block-radar', to );
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
