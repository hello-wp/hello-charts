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
	title: __( 'Pie Chart' ),
	icon: 'chart-pie',
	category: 'charts',
	keywords: [ __( 'graph' ), __( 'doughnut' ), __( 'donut' ) ],
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
				labels: [ 'A', 'B', 'C' ],
				datasets: [
					{
						label: 'Data',
						data: [ 'generate' ],
						cutout: '0%',
					},
				],
			} ),
		},
		chartOptions: {
			type: 'string',
			default: JSON.stringify( {
				animation: false,
				legend: {
					display: true,
					position: 'top',
					align: 'center',
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

