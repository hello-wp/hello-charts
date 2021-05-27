/**
 * BLOCK: Line Chart
 */

/**
 * Components and dependencies.
 */
import { Line } from 'react-chartjs-2';
import { ChartStyles, DataStyles } from '.';
import {
	ChartFormattingToolbar,
	EditDataButton,
	EditDataModal,
	EditDataToolbar,
	Legend,
} from '../../../common/components';
import {
	hex2rgba,
	randomColors,
	randomValues,
} from '../../../common/helpers';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { BlockControls, InspectorControls, RichText } = wp.blockEditor;

export default class Edit extends Component {
	constructor( props ) {
		super( props );

		// Setup the attributes
		const {
			attributes: {
				chartData,
				chartOptions,
			},
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );
		const themeColors = randomColors( parsedData.datasets.length );

		this.state = { editorOpen: false };

		parsedData.init = true;
		parsedOptions.init = true;

		parsedData.datasets.forEach( ( dataset, index ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = randomValues( 6 );
			}

			if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
				dataset.borderColor = themeColors[ index ];
				dataset.pointBackgroundColor = themeColors[ index ];
				dataset.backgroundColor = hex2rgba( themeColors[ index ], 0.6 );
			}
		} );

		setAttributes( {
			chartType: 'line',
			blockId: clientId,
			chartData: JSON.stringify( parsedData ),
			chartOptions: JSON.stringify( parsedOptions ),
		} );
	}

	onNewDataset( dataset ) {
		const color = randomColors( 1 ).shift();

		dataset.label = __( 'New Dataset', 'hello-charts' );
		dataset.borderColor = color;
		dataset.pointBackgroundColor = color;
		dataset.backgroundColor = hex2rgba( color, 0.6 );
	}

	toggleEditor() {
		this.setState( { editorOpen: this.state.editorOpen ? false : true } );
	}

	render() {
		const {
			attributes: {
				title,
				blockId,
				chartData,
				chartOptions,
				showChartTitle,
			},
			className,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		this.toggleEditor = this.toggleEditor.bind( this );
		this.onNewDataset = this.onNewDataset.bind( this );

		return (
			<>
				<InspectorControls key="inspector">
					<EditDataButton toggleEditor={ this.toggleEditor } />
					<ChartStyles { ...this.props } />
					<DataStyles { ...this.props } />
					<Legend { ...this.props } />
				</InspectorControls>
				<BlockControls>
					<EditDataToolbar toggleEditor={ this.toggleEditor } />
					<ChartFormattingToolbar { ...this.props } />
				</BlockControls>
				<div className={ className } key="preview">
					<div className="wrapper">
						{ showChartTitle && (
							<RichText
								tagName="h3"
								className="chart-title"
								placeholder={ __( 'Line Chart', 'hello-charts' ) }
								value={ title }
								allowedFormats={ [] }
								withoutInteractiveFormatting={ true }
								onChange={ ( value ) => setAttributes( { title: value } ) }
							/>
						) }
						{ ! this.state.editorOpen && (
							<div className="chart">
								<Line id={ blockId } data={ parsedData } options={ parsedOptions } />
							</div>
						) }
						{ this.state.editorOpen && (
							<EditDataModal toggleEditor={ this.toggleEditor } onNewDataset={ this.onNewDataset } { ...this.props } />
						) }
					</div>
				</div>
			</>
		);
	}
}
