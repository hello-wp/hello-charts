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
	MenuGroup,
	MenuItem,
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
			data.labels.push( __( 'New Row', 'hello-charts' ) );
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

		/**
		 * This is tied to the onBlur event of MenuItems inside DropDownMenus.
		 * This workaround is needed due to a bug affecting DropDownMenus.
		 * The default behaviour is to hide the DropDown's Popover when it
		 * loses focus, but this doesn't work in a Modal.
		 *
		 * @param {Event}			event	The triggering event.
		 * @param {function():void}	close	The callback function.
		 * @see https://github.com/WordPress/gutenberg/issues/32128
		 */
		function maybeClose( event, close ) {
			if ( 'menuitem' !== event.relatedTarget.getAttribute( 'role' ) ) {
				setTimeout( close, 100 );
			}
		}

		return (
			<Modal
				title={ (
					<>
						{ __( 'Edit Chart Data', 'hello-charts' ) }
						<Button isPrimary className="data-editor-done" onClick={ toggleEditor }>{ __( 'Done', 'hello-charts' ) }</Button>
					</>
				) }
				className="hello-charts-data-editor"
				onRequestClose={ toggleEditor }
				shouldCloseOnClickOutside={ true }
				isDismissible={ false }
			>
				<table>
					<thead>
						<tr>
							<th key="-1" className="title hello-charts-table-th"></th>
							{ parsedData.datasets.map( ( dataset, index ) => (
								<th
									className="hello-charts-table-th"
									key={ index }
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
												label={ __( 'Data Set Actions', 'hello-charts' ) }
											>
												{ ( { onClose } ) => (
													<MenuGroup>
														<MenuItem
															icon="table-col-delete"
															onClick={ () => removeDataset( index ) }
															onBlur={ ( event ) => maybeClose( event, onClose ) }
														>
															{ __( 'Delete Data Set', 'hello-charts' ) }
														</MenuItem>
													</MenuGroup>
												) }
											</DropdownMenu>
										</FlexItem>
									</Flex>
								</th>
							) ) }
							<th key="new" className="new hello-charts-table-th">
								<Button className="hello-charts-add-col-button" onClick={ () => newDataset() } label={ __( 'New Data Set', 'hello-charts' ) }><Icon icon="table-col-after" /></Button>
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
										label={ __( 'Row Actions', 'hello-charts' ) }
									>
										{ ( { onClose } ) => (
											<MenuGroup>
												<MenuItem
													icon="table-row-delete"
													onClick={ () => removeRow( row ) }
													onBlur={ ( event ) => maybeClose( event, onClose ) }
												>
													{ __( 'Delete Row', 'hello-charts' ) }
												</MenuItem>
											</MenuGroup>
										) }
									</DropdownMenu>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
				<Button className="hello-charts-add-row-button" onClick={ () => newRow() } label={ __( 'New Row', 'hello-charts' ) }><Icon icon="table-row-after" /></Button>
			</Modal>
		);
	}
}
