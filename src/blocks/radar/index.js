/**
 * BLOCK: Radar Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Components and dependencies.
 */
import { Edit } from './components';
import { Save } from '../../common/components';

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
	icon: 'admin-site-alt3',
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ), __( 'web', 'hello-charts' ), __( 'spider', 'hello-charts' ) ],
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
				labels: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ],
				datasets: [
					{
						label: __( 'Dataset', 'hello-charts' ),
						fill: true,
						borderWidth: 3,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
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
						},
						suggestedMin: null,
					},
				},
				layout: {
					padding: 20,
				},
			} ),
		},
	},
	example: {
		attributes: {
			title: __( 'Radar Chart', 'hello-charts' ),
			height: 280,
			chartData: JSON.stringify( {
				labels: [ 'A', 'B', 'C', 'D', 'E', 'F' ],
				datasets: [
					{
						fill: true,
						borderWidth: 3,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						tension: 0,
						pointStyle: 'circle',
						data: [ 5, 19, 14, 15, 6, 15 ],
						borderColor: '#0693e3',
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
				},
				scales: {
					r: {
						pointLabels: {
							display: false,
						},
						ticks: {
							display: false,
						},
						suggestedMin: 0,
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
