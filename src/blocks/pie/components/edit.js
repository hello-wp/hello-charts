/**
 * BLOCK: Pie Chart
 */

/**
 * Components and dependencies.
 */
import { Pie } from 'react-chartjs-2';
import { ChartStyles, DataStyles } from '.';
import {
	ChartFormattingToolbar,
	EditDataButton,
	EditDataModal,
	EditDataToolbar,
	Legend,
} from '../../../common/components';
import { randomColors, randomValues } from '../../../common/helpers';

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

		this.state = { editorOpen: false };

		parsedData.init = true;
		parsedOptions.init = true;

		parsedData.datasets.forEach( ( dataset ) => {
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

		setAttributes( {
			chartType: 'pie',
			blockId: clientId,
			chartData: JSON.stringify( parsedData ),
			chartOptions: JSON.stringify( parsedOptions ),
		} );
	}

	onNewDataset( dataset ) {
		const colors = randomColors( dataset.data.length );

		dataset.label = __( 'New Data Set', 'hello-charts' );
		dataset.borderColor = colors;
		dataset.backgroundColor = colors;
	}

	toggleEditor() {
		this.setState( { editorOpen: this.state.editorOpen ? false : true } );
	}

	render() {
		const {
			attributes: {
				blockId,
				chartData,
				chartOptions,
				height,
				showChartTitle,
				title,
				width,
			},
			className,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		this.toggleEditor = this.toggleEditor.bind( this );

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
								placeholder={ __( 'Pie Chart', 'hello-charts' ) }
								value={ title }
								allowedFormats={ [] }
								withoutInteractiveFormatting={ true }
								onChange={ ( value ) => setAttributes( { title: value } ) }
							/>
						) }
						{ ! this.state.editorOpen && (
							<div className="chart">
								<Pie height={ height } width={ width } id={ blockId } data={ parsedData } options={ parsedOptions } />
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
