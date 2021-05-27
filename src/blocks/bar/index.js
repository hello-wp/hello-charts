/**
 * BLOCK: Bar Chart
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
registerBlockType( 'hello-charts/block-bar', {
	title: __( 'Bar Chart', 'hello-charts' ),
	description: __( 'Use a Bar Chart to display your data in vertical (or horizontal) bars. Bar Charts are great for comparing data sets side by side.', 'hello-charts' ),
	icon: 'chart-bar',
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ) ],
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
				},
				scales: {
					x: {
						grid: {
							display: true,
						},
					},
					y: {
						grid: {
							display: true,
						},
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
