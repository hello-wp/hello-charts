/**
 * BLOCK: Line Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component, createRef } = wp.element;
const { InspectorControls, RichText } = wp.blockEditor;
const {
	Button,
	TextareaControl,
} = wp.components;

/**
 * Components and dependencies.
 */
import { Line } from 'react-chartjs-3';
import { ChartStyles, DataStyles } from '.';
import { Legend } from '../../../common/components';
import { randomColors } from '../../../common/helpers';

export default class Edit extends Component {
	constructor( props ) {
		super( props );

		// Setup the attributes
		const {
			attributes: { chartData },
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		this.state = {
			editorOpen: false,
			containerHeight: 0,
		};

		this.chartRef = createRef();

		parsedData.datasets = randomColors( parsedData.datasets );

		setAttributes( {
			activeDatasetIndex: 0,
			chartType: 'line',
			blockId: clientId,
			chartData: JSON.stringify( parsedData ),
		} );
	}

	getInitialState() {
		return {
			editorOpen: false,
		};
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

		return (
			<>
				<InspectorControls key="inspector">
					<ChartStyles { ...this.props } />
					<DataStyles { ...this.props } />
					<Legend { ...this.props } />
				</InspectorControls>
				<div className={ className } key="preview">
					<Button
						isSecondary
						className="data-editor-toggle"
						label={ __( 'Toggle Data Editor' ) }
						onClick={ () => this.setState( { editorOpen: this.state.editorOpen ? false : true } ) }
					>
						{ this.state.editorOpen ? (
							<>View Chart</>
						) : (
							<>Edit Chart Data</>
						) }
					</Button>
					<RichText
						tagName="h3"
						placeholder={ __( 'Line Chart' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
					{ ! this.state.editorOpen && (
						<div className="chart" ref={ this.chartRef }>
							<Line id={ blockId } data={ parsedData } options={ parsedOptions } />
						</div>
					) }
					{ this.state.editorOpen && (
						<div className="data-editor" style={ { height: `calc(${ this.chartRef.current.clientHeight }px - 1em)` } }>
							<TextareaControl value={ JSON.stringify( parsedData.datasets ) } />
						</div>
					) }
				</div>
			</>
		);
	}
}
