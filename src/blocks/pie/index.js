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
import { ChartStyles, DataStyles } from './components';
import { Pie } from 'react-chartjs-2';
import { Edit, Save } from '../../common/components';
import { randomColors, randomValues } from '../../common/helpers';

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
	example: {
		attributes: {
			title: __( 'Pie Chart', 'hello-charts' ),
			height: 280,
			chartData: JSON.stringify( {
				datasets: [
					{
						data: [ 6, 4, 9, 10 ],
						borderColor: [ '#cf2e2e', '#00d084', '#0693e3', '#9b51e0' ],
						backgroundColor: [ '#cf2e2e', '#00d084', '#0693e3', '#9b51e0' ],
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
				},
			} ),
		},
	},

	/* Render the block components. */
	edit: ( props ) => {
		const {
			attributes: {
				blockId,
				chartData,
				chartOptions,
				height,
				width,
			},
		} = props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		return (
			<Edit
				{ ...props }
				ChartStyles={ ChartStyles }
				DataStyles={ DataStyles }
				chartType="pie"
				maybeGenerateData={ maybeGenerateData }
				onNewDataset={ onNewDataset }
				titlePlaceholder={ __( 'Pie Chart', 'hello-charts' ) }
			>
				<Pie
					height={ height }
					width={ width }
					id={ blockId }
					data={ parsedData }
					options={ parsedOptions }
				/>
			</Edit>
		);
	},

	/* Save the block markup. */
	save: ( props ) => {
		return <Save { ...props } />;
	},
} );

const maybeGenerateData = ( datasets ) => {
	datasets.forEach( ( dataset ) => {
		if ( 'generate' === dataset.data[ 0 ] ) {
			dataset.data = randomValues( 4, 1, 10 );
		}

		if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
			const themeColors = randomColors( dataset.data.length );
			dataset.borderColor = [];
			dataset.backgroundColor = [];
			dataset.data.forEach( ( data, index ) => {
				dataset.borderColor.push( themeColors[ index ] );
				dataset.backgroundColor.push( themeColors[ index ] );
			} );
		}
	} );
};

const onNewDataset = ( dataset ) => {
	const colors = randomColors( dataset.data.length );

	dataset.label = __( 'New Data Set', 'hello-charts' );
	dataset.borderColor = colors;
	dataset.backgroundColor = colors;
};
