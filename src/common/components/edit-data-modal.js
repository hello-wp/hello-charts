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
	KeyboardShortcuts,
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
		let focusTimeout;

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

			if ( '' === value || ! isNaN( int ) ) {
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

		function handleFocus( event ) {
			clearTimeout( focusTimeout );

			focusTimeout = setTimeout(
				( target ) => {
					if ( 'true' === target.getAttribute( 'contenteditable' ) ) {
						// RichText contenteditable fields.
						const selection = target.ownerDocument.getSelection();
						const range = document.createRange();
						range.selectNodeContents( target );
						selection.removeAllRanges();
						selection.addRange( range );
					} else {
						// Regular input fields.
						target.select();
					}
				},
				10,
				event.target
			);
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

		function nextCell( event ) {
			event.preventDefault();
			clearTimeout( focusTimeout );

			const thead = event.target.closest( 'table' ).firstChild;
			const tbody = event.target.closest( 'table' ).lastChild;
			const row = event.target.closest( 'tr' );
			const cell = event.target.closest( 'td,th' );

			if ( cell.nextSibling && cell.nextSibling !== row.lastChild ) {
				cell.nextSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( row.nextSibling ) {
				row.nextSibling.firstChild.querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( row.closest( 'thead' ) ) {
				tbody.querySelector( 'input,[contenteditable="true"]' ).focus();
			} else {
				thead.querySelector( 'input,[contenteditable="true"]' ).focus();
			}
		}

		function previousCell( event ) {
			event.preventDefault();
			clearTimeout( focusTimeout );

			const thead = event.target.closest( 'table' ).firstChild;
			const tbody = event.target.closest( 'table' ).lastChild;
			const row = event.target.closest( 'tr' );
			const cell = event.target.closest( 'td,th' );

			if ( cell.previousSibling && cell.previousSibling !== thead.firstChild.firstChild ) {
				cell.previousSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( row.previousSibling ) {
				row.previousSibling.lastChild.previousSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( row.closest( 'thead' ) ) {
				tbody.lastChild.lastChild.previousSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
			} else {
				thead.firstChild.lastChild.previousSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
			}
		}

		function nextRow( event ) {
			event.preventDefault();
			clearTimeout( focusTimeout );

			const thead = event.target.closest( 'table' ).firstChild;
			const tbody = event.target.closest( 'table' ).lastChild;
			const row = event.target.closest( 'tr' );
			const cell = event.target.closest( 'td,th' );
			const index = Array.prototype.indexOf.call( row.children, cell );

			if ( row.nextSibling ) {
				row.nextSibling.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( row.closest( 'thead' ) ) {
				tbody.firstChild.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( thead.firstChild.children[ index + 1 ] !== thead.firstChild.lastChild ) {
				thead.firstChild.children[ index + 1 ].querySelector( 'input,[contenteditable="true"]' ).focus();
			} else {
				tbody.firstChild.firstChild.querySelector( 'input,[contenteditable="true"]' ).focus();
			}
		}

		function previousRow( event ) {
			event.preventDefault();
			clearTimeout( focusTimeout );

			const thead = event.target.closest( 'table' ).firstChild;
			const tbody = event.target.closest( 'table' ).lastChild;
			const row = event.target.closest( 'tr' );
			const cell = event.target.closest( 'td,th' );
			const index = Array.prototype.indexOf.call( row.children, cell );

			if ( row.previousSibling ) {
				row.previousSibling.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( row.closest( 'thead' ) ) {
				tbody.lastChild.children[ index - 1 ].querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( thead.firstChild.children[ index ] !== thead.firstChild.firstChild ) {
				thead.firstChild.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
			} else {
				tbody.lastChild.lastChild.previousSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
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
				<KeyboardShortcuts
					shortcuts={ {
						tab: nextCell,
						enter: nextRow,
						'shift+tab': previousCell,
						'shift+enter': previousRow,
					} }
					bindGlobal={ true }
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
													value={ dataset.label }
													multiline={ false }
													allowedFormats={ [] }
													withoutInteractiveFormatting={ true }
													preserveWhiteSpace={ false }
													onChange={ ( text ) => updateDatasetLabel( text, index ) }
													onFocus={ ( event ) => handleFocus( event ) }
													style={ { whiteSpace: 'nowrap' } }
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
									<Button
										className="hello-charts-add-col-button"
										onClick={ () => newDataset() }
										label={ __( 'New Data Set', 'hello-charts' ) }
									>
										<Icon icon="table-col-after" />
									</Button>
								</th>
							</tr>
						</thead>
						<tbody>
							{ parsedData.labels.map( ( label, row ) => (
								<tr className="hello-charts-table-row" key={ row }>
									<th className="title hello-charts-table-th">
										<RichText
											value={ label }
											multiline={ false }
											allowedFormats={ [] }
											withoutInteractiveFormatting={ true }
											preserveWhiteSpace={ false }
											onChange={ ( text ) => updateLabel( text, row ) }
											onFocus={ ( event ) => handleFocus( event ) }
										/>
									</th>
									{ parsedData.datasets.map( ( dataset, index ) => (
										<td className="hello-charts-table-cell" key={ `${ row }-${ index }` }>
											<input
												type="number"
												value={ parsedData.datasets[ index ].data[ row ] }
												onChange={ ( event ) => updateData( event.target.value, index, row ) }
												onFocus={ ( event ) => handleFocus( event ) }
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
					<Button
						className="hello-charts-add-row-button"
						onClick={ () => newRow() }
						label={ __( 'New Row', 'hello-charts' ) }
					>
						<Icon icon="table-row-after" />
					</Button>
				</KeyboardShortcuts>
			</Modal>
		);
	}
}
