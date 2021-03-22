/**
 * BLOCK: Line Chart
 */

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component, createRef } = wp.element;
const { InspectorControls, RichText } = wp.blockEditor;
const { Button, TextareaControl } = wp.components;

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

		this.state = { editorOpen: false };

		this.chartRef = createRef();
		this.dataRef = createRef();

		parsedData.datasets = randomColors( parsedData.datasets );

		setAttributes( {
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
			data.datasets[ index ].data[ row ] = parseInt( value );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

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
						<div
							className="data-editor"
							ref={ this.dataRef }
							style={
								{ height: `${ this.chartRef?.current?.clientHeight ?? this.dataRef?.current?.clientHeight }px` }
							}
						>
							<table>
								<thead>
									<tr>
										<th key="-1"></th>
										{ parsedData.datasets.map( ( dataset, index ) => (
											<th key={ index }>
												<RichText
													tagName="span"
													value={ dataset.label }
													onChange={ ( text ) => updateDatasetLabel( text, index ) }
												/>
											</th>
										) ) }
									</tr>
								</thead>
								<tbody>
									{ parsedData.labels.map( ( label, row ) => (
										<tr key={ row }>
											<th>
												<RichText
													tagName="span"
													value={ label }
													onChange={ ( text ) => updateLabel( text, row ) }
												/>
											</th>
											{ parsedData.datasets.map( ( dataset, index ) => (
												<td key={ `${row}-${index}` }>
													<RichText
														tagName="span"
														value={ parsedData.datasets[ index ].data[ row ].toString() }
														onChange={ ( value ) => updateData( value, index, row ) }
													/>
												</td>
											) ) }
										</tr>
									) ) }
								</tbody>
							</table>
						</div>
					) }
				</div>
			</>
		);
	}
}
