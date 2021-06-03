/**
 * BLOCK: Area Chart
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
registerBlockType( 'hello-charts/block-area', {
	title: __( 'Area Chart', 'hello-charts' ),
	description: __( 'Use an Area Chart to visualize data trends in a filled shape. Area Charts are useful for showing cumulative totals in two or more data sets.', 'hello-charts' ),
	icon: icons.area,
	category: 'charts',
	keywords: [ __( 'graph', 'hello-charts' ) ],
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
				labels: [ '1', '2', '3', '4', '5', '6' ],
				datasets: [
					{
						label: 'A',
						fill: 'start',
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 'generate' ],
					},
					{
						label: 'B',
						fill: '-1',
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
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
					},
					y: {
						grid: {
							display: true,
						},
						stacked: true,
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
			title: __( 'Area Chart', 'hello-charts' ),
			showChartTitle: false,
			height: 280,
			width: 450,
			chartData: JSON.stringify( {
				labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ],
				datasets: [
					{
						label: 'A',
						fill: 'start',
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 15, 13, 6, 11, 7, 12 ],
						borderColor: '#0693e3',
						pointBackgroundColor: '#0693e3',
						backgroundColor: 'rgba(6, 147, 227, 0.6)',
					},
					{
						label: 'B',
						fill: '-1',
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 10, 19, 6, 7, 8, 15 ],
						borderColor: '#cf2e2e',
						pointBackgroundColor: '#cf2e2e',
						backgroundColor: 'rgba(207, 46, 46, 0.6)',
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
					y: {
						stacked: true,
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
