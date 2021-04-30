/**
 * Helpers.
 */
import { hex2rgba, randomColor } from '../helpers';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	__experimentalNumberControl,
	Button,
	DropdownMenu,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
	Modal,
} = wp.components;
const { RichText } = wp.blockEditor;

let { NumberControl } = wp.components;

if ( typeof NumberControl === 'undefined' ) {
	NumberControl = __experimentalNumberControl;
}

export default class EditDataModal extends Component {
	render() {
		const {
			attributes: {
				chartData,
			},
			setAttributes,
			toggleEditor,
		} = this.props;

		const parsedData = JSON.parse( chartData );

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

		function newDataset() {
			const data = JSON.parse( chartData );
			const rows = data.datasets[ 0 ].data.length;
			const color = randomColor();
			const dataset = { ...data.datasets[ 0 ] };

			dataset.label = __( 'New Dataset' );
			dataset.data = new Array( rows ).fill( 0 );
			dataset.borderColor = color;
			dataset.pointBackgroundColor = color;
			dataset.backgroundColor = hex2rgba( color, 0.6 );

			data.datasets.push( dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function newRow() {
			const data = JSON.parse( chartData );
			data.labels.push( __( 'New Row' ) );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].data.push( 0 );
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function removeDataset( index ) {
			const data = JSON.parse( chartData );
			data.datasets.splice( index, 1 );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function removeRow( row ) {
			const data = JSON.parse( chartData );
			data.labels.splice( row, 1 );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].data.splice( row, 1 );
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		return (
			<Modal
				title={ __( 'Edit Chart Data' ) }
				className="hello-charts-data-editor"
				onRequestClose={ toggleEditor }
				shouldCloseOnClickOutside={ false }
			>
				<table>
					<thead>
						<tr>
							<th key="-1" className="title"></th>
							{ parsedData.datasets.map( ( dataset, index ) => (
								<th
									key={ index }
									style={ { backgroundColor: dataset.backgroundColor } }
								>
									<Flex>
										<FlexBlock>
											<RichText
												tagName="span"
												value={ dataset.label }
												allowedFormats={ [] }
												withoutInteractiveFormatting={ true }
												onChange={ ( text ) => updateDatasetLabel( text, index ) }
											/>
										</FlexBlock>
										<FlexItem>
											<DropdownMenu
												icon="ellipsis"
												label={ __( 'Dataset Actions' ) }
												controls={ [
													{
														title: __( 'Delete Dataset' ),
														label: __( 'Delete Dataset' ),
														icon: 'table-col-delete',
														onClick: () => removeDataset( index ),
													},
												] }
											/>
										</FlexItem>
									</Flex>
								</th>
							) ) }
							<th key="new" className="new">
								<Button onClick={ () => newDataset() } label={ __( 'New Dataset' ) }><Icon icon="table-col-after" /></Button>
							</th>
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
								<td className="disabled">
									<DropdownMenu
										icon="ellipsis"
										label={ __( 'Row Actions' ) }
										controls={ [
											{
												title: __( 'Delete Row' ),
												label: __( 'Delete Row' ),
												icon: 'table-row-delete',
												onClick: () => removeRow( row ),
											},
										] }
									/>
								</td>
							</tr>
						) ) }
						<tr>
							<td className="new">
								<Button onClick={ () => newRow() } label={ __( 'New Row' ) }><Icon icon="table-row-after" /></Button>
							</td>
							<td className="disabled" colSpan={ parsedData.datasets.length + 1 }></td>
						</tr>
					</tbody>
				</table>
			</Modal>
		);
	}
}
