/**
 * External components.
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { createRef, Component } = wp.element;
const {
	Button,
	KeyboardShortcuts,
	Modal,
} = wp.components;

/**
 * Internal dependencies.
 */
import { EditDataContextualMenu } from '.';
import { randomColors } from '../helpers';

export default class EditDataModal extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			activeCol: null,
			activeRow: null,
			table: null,
		};

		this.tableRef = createRef();
	}

	componentDidMount() {
		this.setState( { table: this.tableRef.current } );
	}

	updateActiveCell( row, column ) {
		this.setState( {
			activeCol: column,
			activeRow: row,
		} );
	}

	render() {
		const {
			state: {
				activeCol,
				activeRow,
				table,
			},
			props: {
				attributes: {
					chartData,
				},
				setAttributes,
				toggleEditor,
				hasSegments,
				defaultAlpha,
			},
		} = this;

		const parsedData = JSON.parse( chartData );

		let blurTimeout = false;

		const tableBlur = ( event ) => {
			if ( event.currentTarget && event.relatedTarget && event.currentTarget.contains( event.relatedTarget ) ) {
				return;
			}

			if ( event.relatedTarget && 'menuitem' === event.relatedTarget.getAttribute( 'role' ) ) {
				return;
			}

			blurTimeout = setTimeout( () => this.updateActiveCell( null, null ), 200 );
		};

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

		const addDataset = ( index ) => {
			const data = JSON.parse( chartData );
			const rows = data.datasets[ 0 ].data.length;
			const dataset = { ...data.datasets[ 0 ] };

			dataset.data = new Array( rows ).fill( '' );
			dataset.label = '';

			if ( ! hasSegments ) {
				const color = tinycolor( randomColors( 1 ).shift() );
				const alpha = defaultAlpha ?? 0.8;
				color.setAlpha( alpha );
				dataset.borderColor = color.toHexString();
				dataset.pointBackgroundColor = color.toHexString();
				dataset.backgroundColor = color.toRgbString();
			}

			if ( 'start' === dataset.fill ) {
				dataset.fill = '-1';
			}

			data.datasets.splice( index, 0, dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );
			setTimeout( setFocus, 10, 0, index + 1 );
		};

		const addRow = ( row ) => {
			const data = JSON.parse( chartData );
			data.labels.splice( row, 0, '' );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 0, '' );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );
			setTimeout( setFocus, 10, row + 1, 0 );
		};

		const duplicateDataset = ( index ) => {
			const data = JSON.parse( chartData );
			const dataset = { ...data.datasets[ index ] };

			data.datasets.splice( index, 0, dataset );

			setAttributes( { chartData: JSON.stringify( data ) } );
			setTimeout( setFocus, 10, 0, index + 2 );
		};

		const duplicateRow = ( row ) => {
			const data = JSON.parse( chartData );

			data.labels.splice( row, 0, data.labels[ row ] );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 0, dataset.data[ row ] );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );
			setTimeout( setFocus, 10, row + 2, 0 );
		};

		const removeDataset = ( index ) => {
			const data = JSON.parse( chartData );
			const row = table.firstChild;

			data.datasets.splice( index, 1 );
			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( row.children[ index + 1 ] && row.children[ index + 1 ] !== row.lastChild ) {
				setTimeout( setFocus, 10, 0, index + 1 );
			} else if ( row.children[ index ] ) {
				setTimeout( setFocus, 10, 0, index );
			}
		};

		const removeRow = ( row ) => {
			const data = JSON.parse( chartData );

			data.labels.splice( row, 1 );
			data.datasets.forEach( ( dataset ) => {
				dataset.data.splice( row, 1 );
			} );

			setAttributes( { chartData: JSON.stringify( data ) } );

			if ( table.children[ row + 1 ] && table.children[ row + 1 ] !== table.lastChild ) {
				setTimeout( setFocus, 10, row + 1, 0 );
			} else if ( table.children[ row ] ) {
				setTimeout( setFocus, 10, row, 0 );
			}
		};

		const setFocus = ( row, column ) => {
			const input = table.children[ row ]?.children[ column ]?.querySelector( 'input' );

			if ( ! input ) {
				return;
			}

			clearTimeout( blurTimeout );
			input.focus();
			this.updateActiveCell( row, column );
		};

		const setGroupFocus = ( event ) => {
			const cell = event.target.closest( 'th' );
			const row = cell.closest( 'tr' );

			if ( ! cell || ! row ) {
				return;
			}

			clearTimeout( blurTimeout );

			if ( row === table.firstChild ) {
				const index = Array.prototype.indexOf.call( row.childNodes, cell );
				table.childNodes.forEach( ( selectedRow ) => {
					selectedRow.childNodes[ index ].classList.add( 'selected-in-column' );
				} );
			} else {
				row.childNodes.forEach( ( selectedCell ) => {
					selectedCell.classList.add( 'selected-in-row' );
				} );
			}
		};

		const removeGroupFocus = () => {
			const cells = table.querySelectorAll( '.selected-in-row, .selected-in-column' );
			cells.forEach( ( cell ) => {
				cell.classList.remove( 'selected-in-row', 'selected-in-column' );
			} );
		};

		const setSelection = ( type ) => {
			const owner = table.ownerDocument;
			const activeElement = owner.activeElement;

			if ( ! activeElement ) {
				return;
			}

			let selectionStart = 0;
			let selectionEnd = 0;

			if ( 'end' === type ) {
				selectionStart = activeElement.value.length;
				selectionEnd = activeElement.value.length;
			}

			if ( 'all' === type ) {
				selectionEnd = activeElement.value.length;
			}

			activeElement.setSelectionRange( selectionStart, selectionEnd );
		};

		function canMoveCarat( direction ) {
			const { activeElement } = table.ownerDocument;

			if ( ! activeElement ) {
				return false;
			}

			const { selectionStart, selectionEnd } = activeElement;

			// If there's a selection, it's always possible to move the carat in either direction.
			if ( selectionStart !== selectionEnd ) {
				return true;
			}

			if ( 'left' === direction && 0 === selectionStart ) {
				return false;
			}

			if ( 'right' === direction && activeElement.value.length === selectionEnd ) {
				return false;
			}

			return true;
		}

		function nextCell( event ) {
			if ( 'ArrowRight' === event.key && canMoveCarat( 'right' ) ) {
				return;
			}

			event.preventDefault();

			const totalCols = table.children[ 0 ].children.length - 1;
			const totalRows = table.children.length - 1;

			if ( activeCol === totalCols && activeRow === totalRows && 'Tab' === event.key ) {
				addRow( totalRows + 1 );
			}

			if ( activeCol === totalCols ) {
				setFocus( activeRow + 1, 0 );
			} else {
				setFocus( activeRow, activeCol + 1 );
			}

			if ( 'Tab' === event.key ) {
				setSelection( 'all' );
			} else {
				setSelection( 'start' );
			}
		}

		function previousCell( event ) {
			if ( 'ArrowLeft' === event.key && canMoveCarat( 'left' ) ) {
				return;
			}

			event.preventDefault();

			const totalCols = table.children[ 0 ].children.length - 1;

			if ( 0 === activeCol ) {
				setFocus( activeRow - 1, totalCols );
			} else {
				setFocus( activeRow, activeCol - 1 );
			}

			if ( 'Tab' === event.key ) {
				setSelection( 'all' );
			} else {
				setSelection( 'end' );
			}
		}

		function nextRow( event ) {
			event.preventDefault();

			const totalRows = table.children.length - 1;

			if ( activeRow === totalRows && 'Enter' === event.key ) {
				addRow( totalRows + 1 );
				setFocus( activeRow + 1, 0 );
			} else {
				setFocus( activeRow + 1, activeCol );
			}

			if ( 'Enter' === event.key ) {
				setSelection( 'all' );
			} else {
				setSelection( 'end' );
			}
		}

		function previousRow( event ) {
			event.preventDefault();

			if ( 0 !== activeRow ) {
				setFocus( activeRow - 1, activeCol );
			}

			if ( 'Enter' === event.key ) {
				setSelection( 'all' );
			} else {
				setSelection( 'end' );
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
					<table ref={ this.tableRef } onBlur={ tableBlur }>
						<tr>
							<th key="-1">
								<input
									type="text"
									tabIndex="0"
									onKeyPress={ ( event ) => { // ignore: jsx-a11y/no-noninteractive-element-interactions
										event.preventDefault();
									} }
									onFocus={ () => this.updateActiveCell( 0, 0 ) }
								/>
							</th>
							{ parsedData.datasets.map( ( dataset, index ) => (
								<th key={ index }>
									{ index + 1 === activeCol && (
										<EditDataContextualMenu
											index={ index }
											itemIconKey="col"
											itemName={ __( 'Data Set', 'hello-charts' ) }
											duplicate={ duplicateDataset }
											add={ addDataset }
											remove={ removeDataset }
											onClick={ setGroupFocus }
											onBlur={ removeGroupFocus }
										/>
									) }
									<input
										type="text"
										onFocus={ () => this.updateActiveCell( 0, index + 1 ) }
										onChange={ ( event ) => updateDatasetLabel( event.target.value, index ) }
										className={ index > getDatasetLabels().indexOf( dataset.label ) || '' === dataset.label ? 'input-error' : '' }
										value={ dataset.label }
									/>
								</th>
							) ) }
						</tr>
						{ parsedData.labels.map( ( label, row ) => (
							<tr key={ row }>
								<th>
									{ row + 1 === activeRow && (
										<EditDataContextualMenu
											index={ row }
											itemIconKey="row"
											itemName={ __( 'Row', 'hello-charts' ) }
											duplicate={ duplicateRow }
											add={ addRow }
											remove={ removeRow }
											onClick={ setGroupFocus }
											onBlur={ removeGroupFocus }
										/>
									) }
									<input
										type="text"
										onFocus={ () => this.updateActiveCell( row + 1, 0 ) }
										onChange={ ( event ) => updateLabel( event.target.value, row ) }
										value={ label }
									/>
								</th>
								{ parsedData.datasets.map( ( dataset, index ) => (
									<td key={ `${ row }-${ index }` }>
										{
										/**
										 * We can't use an input type number here, due to a chromium bug
										 * that prevents selection positions for number inputs.
										 *
										 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=349432
										 */
										}
										<input
											type="text"
											inputMode="numeric"
											value={ dataset.data[ row ] }
											onFocus={ () => this.updateActiveCell( row + 1, index + 1 ) }
											onChange={ ( event ) => updateData( event.target.value, index, row ) }
										/>
									</td>
								) ) }
							</tr>
						) ) }
					</table>
				</KeyboardShortcuts>
			</Modal>
		);
	}
}
