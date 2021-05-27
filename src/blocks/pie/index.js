/**
 * BLOCK: Pie Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Components and dependencies.
 */
import { Edit, Save } from './components';

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
	icon: 'chart-pie',
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ), __( 'doughnut', 'hello-charts' ), __( 'donut', 'hello-charts' ) ],
	attributes: {
		blockId: {
			type: 'string',
			default: '',
		},
		title: {
			type: 'string',
			default: '',
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
						label: __( 'Dataset', 'hello-charts' ),
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

