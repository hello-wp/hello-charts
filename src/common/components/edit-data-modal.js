/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	Button,
	DropdownMenu,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
	Modal,
} = wp.components;
const { RichText } = wp.blockEditor;

export default class EditDataModal extends Component {
	render() {
		const {
			attributes: {
				chartData,
			},
			setAttributes,
			toggleEditor,
			onNewDataset,
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
			const dataset = { ...data.datasets[ 0 ] };

			dataset.data = new Array( rows ).fill( 1 );

			onNewDataset( dataset );

			data.datasets.push( dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function newRow() {
			const data = JSON.parse( chartData );
			data.labels.push( __( 'New Row' ) );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].data.push( 1 );
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
							<th key="-1" className="title hello-charts-table-th"></th>
							{ parsedData.datasets.map( ( dataset, index ) => (
								<th
									key={ index }
									style={ typeof dataset.backgroundColor === 'string' ? { backgroundColor: dataset.backgroundColor } : {} }
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
							<th key="new" className="new hello-charts-table-th">
								<Button onClick={ () => newDataset() } label={ __( 'New Dataset' ) }><Icon icon="table-col-after" /></Button>
							</th>
						</tr>
					</thead>
					<tbody>
						{ parsedData.labels.map( ( label, row ) => (
							<tr className="hello-charts-table-row" key={ row }>
								<th className="title hello-charts-table-th">
									<RichText
										tagName="span"
										value={ label }
										allowedFormats={ [] }
										withoutInteractiveFormatting={ true }
										onChange={ ( text ) => updateLabel( text, row ) }
									/>
								</th>
								{ parsedData.datasets.map( ( dataset, index ) => (
									<td className="hello-charts-table-cell" key={ `${ row }-${ index }` }>
										<input
											type="number"
											value={ parsedData.datasets[ index ].data[ row ] }
											onChange={ ( event ) => updateData( event.target.value, index, row ) }
										/>
									</td>
								) ) }
								<td className="disabled hello-charts-delete-row-cell">
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
							<td className="new hello-charts-table-th">
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
