/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	Button,
	DropdownMenu,
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

		function newDataset( index ) {
			const data = JSON.parse( chartData );
			const rows = data.datasets[ 0 ].data.length;
			const dataset = { ...data.datasets[ 0 ] };

			dataset.data = new Array( rows ).fill( null );
			dataset.label = '';

			onNewDataset( dataset );

			data.datasets.splice( index, 0, dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );

			setTimeout( () => {
				const thead = document.querySelector( '.hello-charts-data-editor table thead' );
				thead.firstChild.children[ index + 1 ].querySelector( 'input,[contenteditable="true"]' ).focus();
			}, 10 );
		}

		function newRow( row ) {
			const data = JSON.parse( chartData );
			data.labels.splice( row, 0, '' );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 0, '' );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );

			setTimeout( () => {
				const tbody = document.querySelector( '.hello-charts-data-editor table tbody' );
				tbody.children[ row ].firstChild.querySelector( 'input,[contenteditable="true"]' ).focus();
			}, 10 );
		}

		function duplicateDataset( index ) {
			const data = JSON.parse( chartData );
			const dataset = { ...data.datasets[ index ] };

			data.datasets.splice( index, 0, dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );

			setTimeout( () => {
				const thead = document.querySelector( '.hello-charts-data-editor table thead' );
				thead.firstChild.children[ index + 2 ].querySelector( 'input,[contenteditable="true"]' ).focus();
			}, 10 );
		}

		function duplicateRow( row ) {
			const data = JSON.parse( chartData );

			data.labels.splice( row, 0, data.labels[ row ] );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 0, dataset.data[ row ] );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );

			setTimeout( () => {
				const tbody = document.querySelector( '.hello-charts-data-editor table tbody' );
				tbody.children[ row + 1 ].firstChild.querySelector( 'input,[contenteditable="true"]' ).focus();
			}, 10 );
		}

		function removeDataset( index ) {
			const data = JSON.parse( chartData );
			const thead = document.querySelector( '.hello-charts-data-editor table thead' );

			data.datasets.splice( index, 1 );
			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( thead.firstChild.children[ index + 1 ] && thead.firstChild.children[ index + 2 ] !== thead.firstChild.lastChild ) {
				thead.firstChild.children[ index + 1 ].querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( thead.firstChild.children[ index ] ) {
				thead.firstChild.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
			}
		}

		function removeRow( row ) {
			const data = JSON.parse( chartData );
			const tbody = document.querySelector( '.hello-charts-data-editor table tbody' );

			data.labels.splice( row, 1 );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 1 );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( tbody.children[ row ] && tbody.children[ row ] !== tbody.lastChild ) {
				tbody.children[ row ].firstChild.querySelector( 'input,[contenteditable="true"]' ).focus();
			} else if ( tbody.children[ row - 1 ] ) {
				tbody.children[ row - 1 ].firstChild.querySelector( 'input,[contenteditable="true"]' ).focus();
			}
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
			if ( ! event.relatedTarget || 'menuitem' !== event.relatedTarget.getAttribute( 'role' ) ) {
				setTimeout( close, 200 );
			}
		}

		function nextCell( event ) {
			event.preventDefault();
			clearTimeout( focusTimeout );

			const cell = event.target.closest( 'td,th' );
			const row = event.target.closest( 'tr' );

			if ( cell.nextSibling === row.lastChild && 'Tab' === event.key ) {
				newDataset( parsedData.datasets.length );
			}

			if ( event.target.previousSibling && 'ArrowRight' === event.key ) {
				event.target.previousSibling.querySelector( 'button' ).focus();
			} else if ( cell.nextSibling === row.lastChild && 'ArrowRight' === event.key ) {
				cell.nextSibling.querySelector( 'button' ).focus();
			} else if ( cell.nextSibling && cell.nextSibling !== row.lastChild ) {
				cell.nextSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
			}
		}

		function previousCell( event ) {
			event.preventDefault();
			clearTimeout( focusTimeout );

			const cell = event.target.closest( 'td,th' );

			if ( cell.previousSibling ) {
				cell.previousSibling.querySelector( 'input,[contenteditable="true"]' ).focus();
			}
		}

		function nextRow( event ) {
			clearTimeout( focusTimeout );

			if ( 'BUTTON' === event.target.tagName && 'Enter' === event.key ) {
				return;
			}

			event.preventDefault();

			const tbody = event.target.closest( 'table' ).firstChild.nextSibling;
			const tfoot = event.target.closest( 'table' ).lastChild;
			const row = event.target.closest( 'tr' );
			const cell = event.target.closest( 'td,th' );
			const index = Array.prototype.indexOf.call( row.children, cell );

			if ( row === tbody.lastChild && 'Enter' === event.key ) {
				newRow( parsedData.datasets[ 0 ].data.length );
			}

			if ( row.nextSibling ) {
				if ( row.lastChild === cell ) {
					row.nextSibling.children[ index ].querySelector( 'button' ).focus();
				} else {
					row.nextSibling.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
				}
			} else if ( row.closest( 'thead' ) ) {
				if ( row.lastChild === cell ) {
					tbody.firstChild.children[ index ].querySelector( 'button' ).focus();
				} else {
					tbody.firstChild.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
				}
			} else if ( row.closest( 'tbody' ) && row.firstChild === cell ) {
				tfoot.firstChild.children[ index ].querySelector( 'button' ).focus();
			}
		}

		function previousRow( event ) {
			clearTimeout( focusTimeout );
			event.preventDefault();

			const tbody = event.target.closest( 'table' ).firstChild.nextSibling;
			const thead = event.target.closest( 'table' ).firstChild;
			const row = event.target.closest( 'tr' );
			const cell = event.target.closest( 'td,th' );
			const index = Array.prototype.indexOf.call( row.children, cell );

			if ( row.previousSibling ) {
				if ( row.lastChild === cell ) {
					row.previousSibling.children[ index ].querySelector( 'button' ).focus();
				} else {
					row.previousSibling.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
				}
			} else if ( row.closest( 'tbody' ) ) {
				if ( row.lastChild === cell ) {
					thead.firstChild.children[ index ].querySelector( 'button' ).focus();
				} else {
					thead.firstChild.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
				}
			} else if ( row.closest( 'tfoot' ) ) {
				tbody.lastChild.children[ index ].querySelector( 'input,[contenteditable="true"]' ).focus();
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
						right: nextCell,
						enter: nextRow,
						down: nextRow,
						'shift+tab': previousCell,
						left: previousCell,
						'shift+enter': previousRow,
						up: previousRow,
						'mod+shift+s': toggleEditor,
					} }
					bindGlobal={ true }
				>
					<table>
						<thead>
							<tr>
								<th key="-1">
									<RichText
										value=""
										multiline={ false }
										allowedFormats={ [] }
										withoutInteractiveFormatting={ true }
										preserveWhiteSpace={ false }
										onChange={ () => {
											return false;
										} }
										onKeyPress={ ( event ) => {
											event.preventDefault();
										} }
									/>
								</th>
								{ parsedData.datasets.map( ( dataset, index ) => (
									<th key={ index }>
										<DropdownMenu
											icon="ellipsis"
											label={ __( 'Data Set Actions', 'hello-charts' ) }
										>
											{ ( { onClose } ) => (
												<MenuGroup>
													<MenuItem
														icon="table-col-after"
														onClick={ () => duplicateDataset( index ) }
														onBlur={ ( event ) => maybeClose( event, onClose ) }
													>
														{ __( 'Duplicate Data Set', 'hello-charts' ) }
													</MenuItem>
													<MenuItem
														icon="table-col-before"
														onClick={ () => newDataset( index ) }
														onBlur={ ( event ) => maybeClose( event, onClose ) }
													>
														{ __( 'Insert Data Set Before', 'hello-charts' ) }
													</MenuItem>
													<MenuItem
														icon="table-col-after"
														onClick={ () => newDataset( index + 1 ) }
														onBlur={ ( event ) => maybeClose( event, onClose ) }
													>
														{ __( 'Insert Data Set After', 'hello-charts' ) }
													</MenuItem>
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
									</th>
								) ) }
								<th key="new" className="new">
									<Button
										onClick={ () => newDataset( parsedData.datasets.length ) }
										label={ __( 'New Data Set', 'hello-charts' ) }
									>
										<Icon icon="table-col-after" />
									</Button>
								</th>
							</tr>
						</thead>
						<tbody>
							{ parsedData.labels.map( ( label, row ) => (
								<tr key={ row }>
									<th>
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
										<td key={ `${ row }-${ index }` }>
											<input
												type="number"
												value={ parsedData.datasets[ index ].data[ row ] }
												onChange={ ( event ) => updateData( event.target.value, index, row ) }
												onFocus={ ( event ) => handleFocus( event ) }
											/>
										</td>
									) ) }
									<td className="disabled">
										<DropdownMenu
											icon="ellipsis"
											label={ __( 'Row Actions', 'hello-charts' ) }
										>
											{ ( { onClose } ) => (
												<MenuGroup>
													<MenuItem
														icon="table-row-after"
														onClick={ () => duplicateRow( row ) }
														onBlur={ ( event ) => maybeClose( event, onClose ) }
													>
														{ __( 'Duplicate Row', 'hello-charts' ) }
													</MenuItem>
													<MenuItem
														icon="table-row-before"
														onClick={ () => newRow( row ) }
														onBlur={ ( event ) => maybeClose( event, onClose ) }
													>
														{ __( 'Insert Row Before', 'hello-charts' ) }
													</MenuItem>
													<MenuItem
														icon="table-row-after"
														onClick={ () => newRow( row + 1 ) }
														onBlur={ ( event ) => maybeClose( event, onClose ) }
													>
														{ __( 'Insert Row After', 'hello-charts' ) }
													</MenuItem>
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
						<tfoot>
							<tr>
								<th key="new" className="new">
									<Button
										onClick={ () => newRow( parsedData.datasets[ 0 ].data.length ) }
										label={ __( 'New Row', 'hello-charts' ) }
									>
										<Icon icon="table-row-after" />
									</Button>
								</th>
								<td
									className="disabled"
									colSpan={ parsedData.datasets.length }
								></td>
							</tr>
						</tfoot>
					</table>
				</KeyboardShortcuts>
			</Modal>
		);
	}
}
