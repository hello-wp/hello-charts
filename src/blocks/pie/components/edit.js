/**
 * BLOCK: Pie Chart
 */

/**
 * Components and dependencies.
 */
import { Pie } from 'react-chartjs-2';
import { ChartStyles, DataStyles } from '.';
import { EditDataButton, EditDataModal, EditDataToolbar, Legend } from '../../../common/components';
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
			attributes: { chartData },
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		this.state = { editorOpen: false };

		parsedData.datasets.forEach( ( dataset ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = randomValues( 30, 1, 10 );
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
		} );
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
				</BlockControls>
				<div className={ className } key="preview">
					<div className="wrapper">
						<RichText
							tagName="h3"
							placeholder={ __( 'Pie Chart' ) }
							value={ title }
							allowedFormats={ [] }
							withoutInteractiveFormatting={ true }
							onChange={ ( value ) => setAttributes( { title: value } ) }
						/>
						{ ! this.state.editorOpen && (
							<div className="chart">
								<Pie id={ blockId } data={ parsedData } options={ parsedOptions } />
							</div>
						) }
						{ this.state.editorOpen && (
							<EditDataModal toggleEditor={ this.toggleEditor } { ...this.props } />
						) }
					</div>
				</div>
			</>
		);
	}
}
