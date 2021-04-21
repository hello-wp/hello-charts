/**
 * BLOCK: Line Chart
 */

/**
 * Components and dependencies.
 */
import { Line } from 'react-chartjs-3';
import { ChartStyles, DataStyles } from '.';
import { EditData, EditDataToolbar, Legend } from '../../../common/components';
import { randomColors } from '../../../common/helpers';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { BlockControls, InspectorControls, RichText } = wp.blockEditor;
const { __experimentalNumberControl, Icon, Modal } = wp.components;

let { NumberControl } = wp.components;

if ( typeof NumberControl === 'undefined' ) {
	NumberControl = __experimentalNumberControl;
}

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

		parsedData.datasets = randomColors( parsedData.datasets );

		setAttributes( {
			chartType: 'line',
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

		function updateDatasetLabel( text, index ) {
			const data = JSON.parse( chartData );
			data.datasets[ index ].label = text;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateLabel( text, row ) {
			const data = JSON.parse( chartData );
			data.labels[ row ] = text;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateData( value, index, row ) {
			const data = JSON.parse( chartData );
			const int = parseInt( value.replace( /\D/g, '' ) ); // Strip non-numeric characters.

			if ( ! isNaN( int ) ) {
				data.datasets[ index ].data[ row ] = int;
			}

			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		return (
			<>
				<InspectorControls key="inspector">
					<EditData toggleEditor={ this.toggleEditor } />
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
							placeholder={ __( 'Line Chart' ) }
							value={ title }
							allowedFormats={ [] }
							withoutInteractiveFormatting={ true }
							onChange={ ( value ) => setAttributes( { title: value } ) }
						/>
						{ ! this.state.editorOpen && (
							<div className="chart">
								<Line id={ blockId } data={ parsedData } options={ parsedOptions } />
							</div>
						) }
						{ this.state.editorOpen && (
							<Modal
								title={ __( 'Edit Chart Data' ) }
								className="hello-charts-data-editor	"
								onRequestClose={ () => this.setState( { editorOpen: false } ) }
								shouldCloseOnClickOutside={ false }
							>
								<table>
									<thead>
										<tr>
											<th key="-1" className="title"></th>
											{ parsedData.datasets.map( ( dataset, index ) => (
												<th key={ index }>
													<RichText
														tagName="span"
														value={ dataset.label }
														allowedFormats={ [] }
														withoutInteractiveFormatting={ true }
														onChange={ ( text ) => updateDatasetLabel( text, index ) }
													/>
												</th>
											) ) }
											<th key="new" className="new"><Icon icon="plus" /></th>
										</tr>
									</thead>
									<tbody>
										{ parsedData.labels.map( ( label, row ) => (
											<tr key={ row }>
												<th className="title">
													<RichText
														tagName="span"
														value={ label }
														allowedFormats={ [] }
														withoutInteractiveFormatting={ true }
														onChange={ ( text ) => updateLabel( text, row ) }
													/>
												</th>
												{ parsedData.datasets.map( ( dataset, index ) => (
													<td key={ `${ row }-${ index }` }>
														<NumberControl
															hideHTMLArrows={ true }
															isDragEnabled={ false }
															value={ parsedData.datasets[ index ].data[ row ] }
															onChange={ ( value ) => updateData( value, index, row ) }
														/>
													</td>
												) ) }
												<td className="disabled"></td>
											</tr>
										) ) }
										<tr>
											<td className="new"><Icon icon="plus" /></td>
											<td className="disabled" colSpan={ parsedData.datasets.length + 1 }></td>
										</tr>
									</tbody>
								</table>
							</Modal>
						) }
					</div>
				</div>
			</>
		);
	}
}
