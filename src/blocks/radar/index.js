/**
 * BLOCK: Line Chart
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
registerBlockType( 'hello-charts/block-radar', {
	title: __( 'Radar Chart' ),
	icon: icons.radar,
	category: 'charts',
	keywords: [ __( 'graph' ) ],
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
				labels: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G' ],
				datasets: [
					{
						label: 'Dataset',
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
