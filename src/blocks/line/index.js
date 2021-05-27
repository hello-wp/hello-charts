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
import { ChartStyles, DataStyles } from './components';
import { Line } from 'react-chartjs-2';
import { Edit, Save } from '../../common/components';
import { hex2rgba, randomColors, randomValues } from '../../common/helpers';

/**
 * Registers this as a block.
 *
 * @see https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'hello-charts/block-line', {
	title: __( 'Line Chart', 'hello-charts' ),
	description: __( 'Use a Line Chart to plot data points along a line. Line Charts are useful for showing trend data, or comparing data sets.', 'hello-charts' ),
	icon: 'chart-line',
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
						fill: false,
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
						fill: false,
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
			title: __( 'Line Chart', 'hello-charts' ),
			height: 280,
			width: 450,
			chartData: JSON.stringify( {
				labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' ],
				datasets: [
					{
						label: 'A',
						fill: false,
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 10, 19, 6, 3, 12, 15 ],
						borderColor: '#cf2e2e',
						pointBackgroundColor: '#cf2e2e',
						backgroundColor: '#cf2e2e',
					},
					{
						label: 'B',
						fill: false,
						showLine: true,
						pointRadius: 3,
						hoverRadius: 3,
						pointBorderWidth: 0,
						lineTension: 0.4,
						pointStyle: 'circle',
						data: [ 15, 13, 3, 11, 1, 10 ],
						borderColor: '#0693e3',
						pointBackgroundColor: '#0693e3',
						backgroundColor: '#0693e3',
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
				chartType="line"
				maybeGenerateData={ maybeGenerateData }
				onNewDataset={ onNewDataset }
				titlePlaceholder={ __( 'Line Chart', 'hello-charts' ) }
			>
				<Line
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
	const themeColors = randomColors( datasets.length );

	datasets.forEach( ( dataset, index ) => {
		if ( 'generate' === dataset.data[ 0 ] ) {
			dataset.data = randomValues( 6 );
		}

		if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
			dataset.borderColor = themeColors[ index ];
			dataset.pointBackgroundColor = themeColors[ index ];
			dataset.backgroundColor = hex2rgba( themeColors[ index ], 0.6 );
		}
	} );
};

const onNewDataset = ( dataset ) => {
	const color = randomColors( 1 ).shift();

	dataset.label = __( 'New Data Set', 'hello-charts' );
	dataset.borderColor = color;
	dataset.pointBackgroundColor = color;
	dataset.backgroundColor = hex2rgba( color, 0.6 );
};
