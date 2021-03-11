/**
 * BLOCK: Line Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n; // Import __() from wp.i18n
const { Component } = wp.element; // Extend component
const { InspectorControls, RichText } = wp.blockEditor;

/**
 * Components and dependencies.
 */
import { Line } from 'react-chartjs-3';
import ChartStyles from './chart-styles';
import DataStyles from './data-styles';
import Legend from '../../../common/components/legend';
import randomColors from '../../../common/helpers/random-colors';

export default class Edit extends Component {
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
					placeholder={ __( 'Line Chart' ) }
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
				/>
				<Line id={ blockId } data={ parsedData } options={ parsedOptions } />
			</div>,
		];
	}
}
