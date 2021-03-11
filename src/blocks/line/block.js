/**
 * BLOCK: Line Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { Component } = wp.element; // Extend component
const { InspectorControls, RichText } = wp.blockEditor;

/**
 * Components and dependencies.
 */
import { Line } from 'react-chartjs-3';
import { ChartStyles, DataStyles } from './components';
import { Legend } from '../../common/components';
import randomColors from '../../common/helpers/random-colors';

class ChartLineBlock extends Component {
	componentDidMount() {
		// Setup the attributes
		const {
			attributes: { chartData },
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		parsedData.datasets = randomColors( parsedData.datasets );

		setAttributes( {
			activeDatasetIndex: 0,
			chartType: 'line',
			blockId: clientId,
			chartData: JSON.stringify( parsedData ),
		} );
	}

	render() {
		const {
			attributes: {
				title,
				blockId,
				chartData,
				chartOptions,
			},
			className,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		return [
			<InspectorControls key="inspector">
				<ChartStyles { ...this.props } />
				<DataStyles { ...this.props } />
				<Legend { ...this.props } />
			</InspectorControls>,
			<div className={ className } key="editor">
				<RichText
					tagName="h3"
					placeholder="Line Chart"
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
				/>
				<Line id={ blockId } data={ parsedData } options={ parsedOptions } />
			</div>,
		];
	}
}

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
	title: __( 'Line Chart' ),
	icon: 'chart-line',
	category: 'charts',
	keywords: [ __( 'charts' ), __( 'graph' ), __( 'data' ) ],
	attributes: {
		blockId: {
			type: 'string',
			default: '',
		},
		title: {
			type: 'string',
			default: '',
		},
		activeDatasetIndex: {
			type: 'integer',
			default: 0,
		},
		chartType: {
			type: 'string',
		},
		chartData: {
			type: 'string',
			default: JSON.stringify( {
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
				legend: {
					display: true,
					position: 'top',
					align: 'center',
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								display: true,
							},
						},
					],
					yAxes: [
						{
							gridLines: {
								display: true,
							},
						},
					],
				},
			} ),
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @see https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @return {*} JSX Component.
	 */
	edit: ChartLineBlock,

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @see https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @return {*} JSX Frontend HTML.
	 */
	save: ( props ) => {
		// Setup the attributes
		const {
			attributes: { title, blockId },
			className,
		} = props;

		return (
			<div className={ className }>
				<RichText.Content tagName="h3" placeholder="Line Chart" value={ title } />
				<canvas id={ `chart-${ blockId }` }></canvas>
			</div>
		);
	},
} );
