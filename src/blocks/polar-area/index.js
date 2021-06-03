/**
 * BLOCK: Polar Area Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal dependencies.
 */
import { Edit } from './components';
import { Save } from '../../common/components';
import { icons } from '../../common/helpers';

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
	attributes: {
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
				plugins: {
					legend: {
						display: true,
						position: 'bottom',
						align: 'center',
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
			} ),
		},
	},
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
				responsive: false,
				plugins: {
					legend: {
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

	/* Render the block components. */
	edit: ( props ) => {
		return <Edit { ...props } />;
	},

	/* Save the block markup. */
	save: ( props ) => {
		return <Save { ...props } />;
	},
} );
