/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { createRef, Component } = wp.element;
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
	constructor( props ) {
		super( props );

		this.state = { table: null };
		this.tableRef = createRef();
	}

	componentDidMount() {
		this.setState( { table: this.tableRef.current } );
	}

	render() {
		const {
			attributes: {
				chartData,
			},
			setAttributes,
			toggleEditor,
			onNewDataset,
		} = this.props;
		const { state: { table } } = this;

		const parsedData = JSON.parse( chartData );

		let focusTimeout = false;

		function getDatasetLabels() {
			const data = JSON.parse( chartData );
			return data.datasets.map( ( dataset ) => dataset.label );
		}

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

		function newDataset( index, focus = true ) {
			const data = JSON.parse( chartData );
			const rows = data.datasets[ 0 ].data.length;
			const dataset = { ...data.datasets[ 0 ] };

			dataset.data = new Array( rows ).fill( null );
			dataset.label = '';

			if ( onNewDataset ) {
				onNewDataset( dataset );
			}

			data.datasets.splice( index, 0, dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( focus ) {
				const thead = table.querySelector( 'thead' );
				setTimeout( setFocus, 10, thead, 0, index + 1 );
			}
		}

		function newRow( row, focus = true ) {
			const data = JSON.parse( chartData );
			data.labels.splice( row, 0, '' );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 0, '' );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( focus ) {
				const tbody = table.querySelector( 'tbody' );
				setTimeout( setFocus, 10, tbody, row, 0 );
			}
		}

		function duplicateDataset( index, focus = true ) {
			const data = JSON.parse( chartData );
			const dataset = { ...data.datasets[ index ] };

			data.datasets.splice( index, 0, dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( focus ) {
				const thead = table.querySelector( 'thead' );
				setTimeout( setFocus, 10, thead, 0, index + 2 );
			}
		}

		function duplicateRow( row, focus = true ) {
			const data = JSON.parse( chartData );

			data.labels.splice( row, 0, data.labels[ row ] );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 0, dataset.data[ row ] );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( focus ) {
				const tbody = table.querySelector( 'tbody' );
				setTimeout( setFocus, 10, tbody, row + 1, 0 );
			}
		}

		function removeDataset( index, focus = true ) {
			const data = JSON.parse( chartData );
			const thead = table.querySelector( 'thead' );
			const row = thead.firstChild;

			data.datasets.splice( index, 1 );
			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( focus ) {
				if ( row.children[ index + 1 ] && row.children[ index + 2 ] !== row.lastChild ) {
					setFocus( thead, 0, index + 1 );
				} else if ( row.children[ index ] ) {
					setFocus( thead, 0, index );
				}
			}
		}

		function removeRow( row, focus = true ) {
			const data = JSON.parse( chartData );
			const tbody = table.querySelector( 'tbody' );

			data.labels.splice( row, 1 );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 1 );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( focus ) {
				if ( tbody.children[ row ] && tbody.children[ row ] !== tbody.lastChild ) {
					setFocus( tbody, row, 0 );
					tbody.children[ row ].firstChild.querySelector( 'input,[contenteditable="true"]' ).focus();
				} else if ( tbody.children[ row - 1 ] ) {
					setFocus( tbody, row - 1, 0 );
				}
			}
		}

		function moveFocus( direction ) {
			const { activeElement } = table.ownerDocument;
			const cell = activeElement.closest( 'td,th' );
			const section = cell.closest( 'thead,tbody,tfoot' );
			const row = Array.prototype.indexOf.call( section.children, cell.closest( 'tr' ) );
			const column = Array.prototype.indexOf.call( cell.closest( 'tr' ).children, cell );

			if ( 'left' === direction && column !== 0 ) {
				setFocus( section, row, column - 1 );
			}

			if ( 'right' === direction && column !== section.children[ 0 ].children.length - 1 ) {
				if (
					activeElement.previousSibling &&
					activeElement.previousSibling.querySelector( 'button' )
				) {
					setFocus( section, row, column, true );
				} else {
					setFocus( section, row, column + 1 );
				}
			}

			if ( 'up' === direction ) {
				if ( row !== 0 ) {
					setFocus( section, row - 1, column );
				} else if ( 'THEAD' !== section.tagName ) {
					setFocus( section.previousSibling, section.previousSibling.children.length - 1, column );
				}
			}

			if ( 'down' === direction ) {
				if ( row !== section.children.length - 1 ) {
					setFocus( section, row + 1, column );
				} else if ( 'TFOOT' !== section.tagName ) {
					setFocus( section.nextSibling, 0, column );
				}
			}
		}

		function setFocus( section, row, column, skipInput = false ) {
			if (
				! section ||
				! section.children[ row ] ||
				! section.children[ row ].children[ column ] ||
				! section.children[ row ].children[ column ].querySelector( 'button,input,[contenteditable="true"]' )
			) {
				return;
			}

			const input = section.children[ row ].children[ column ].querySelector( 'input,[contenteditable="true"]' );
			const button = section.children[ row ].children[ column ].querySelector( 'button' );
			if ( input && ! skipInput ) {
				input.focus();
			} else {
				button.focus();
			}
		}

		function selectText( event ) {
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
					} else if ( target.select ) {
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

			if ( cell.nextSibling === row.lastChild && 'Tab' === event.key && 'TH' !== cell.tagName ) {
				newDataset( parsedData.datasets.length, false );
			}

			moveFocus( 'right' );
		}

		function previousCell( event ) {
			event.preventDefault();
			clearTimeout( focusTimeout );

			moveFocus( 'left' );
		}

		function nextRow( event ) {
			clearTimeout( focusTimeout );

			if ( 'BUTTON' === event.target.tagName && 'Enter' === event.key ) {
				return;
			}

			event.preventDefault();

			const tbody = table.firstChild.nextSibling;
			const cell = event.target.closest( 'td,th' );
			const row = event.target.closest( 'tr' );

			if ( row === tbody.lastChild && 'Enter' === event.key && 'TH' !== cell.tagName ) {
				newRow( parsedData.datasets[ 0 ].data.length, false );
			}

			moveFocus( 'down' );
		}

		function previousRow( event ) {
			clearTimeout( focusTimeout );
			event.preventDefault();

			moveFocus( 'up' );
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
					<table ref={ this.tableRef }>
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
											disableOpenOnArrowDown={ true }
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
											onFocus={ ( event ) => selectText( event ) }
											style={ { whiteSpace: 'nowrap' } }
											className={ index > getDatasetLabels().indexOf( dataset.label ) || '' === dataset.label ? 'input-error' : '' }
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
											onFocus={ ( event ) => selectText( event ) }
										/>
									</th>
									{ parsedData.datasets.map( ( dataset, index ) => (
										<td key={ `${ row }-${ index }` }>
											<input
												type="number"
												value={ parsedData.datasets[ index ].data[ row ] }
												onChange={ ( event ) => updateData( event.target.value, index, row ) }
												onFocus={ ( event ) => selectText( event ) }
											/>
										</td>
									) ) }
									<td className="disabled">
										<DropdownMenu
											icon="ellipsis"
											label={ __( 'Row Actions', 'hello-charts' ) }
											disableOpenOnArrowDown={ true }
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
