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
			},
		} = this;

		const parsedData = JSON.parse( chartData );

		let blurTimeout = false;

		const tableBlur = ( event ) => {
			if ( ! event.currentTarget.contains( event.relatedTarget ) ) {
				blurTimeout = setTimeout( () => this.updateActiveCell( null, null ), 200 );
			}
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
				color.setAlpha( 0.8 );
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
			const input = table.children[ row ]?.children[ column ]?.querySelector( 'input,[contenteditable="true"]' );
			if ( input ) {
				input.focus();
				clearTimeout( blurTimeout );
				this.updateActiveCell( row, column );
			}
		};

		function nextCell( event ) {
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
		}

		function previousCell( event ) {
			event.preventDefault();
			const totalCols = table.children[ 0 ].children.length - 1;

			if ( 0 === activeCol ) {
				setFocus( activeRow - 1, totalCols );
			} else {
				setFocus( activeRow, activeCol - 1 );
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
		}

		function previousRow( event ) {
			event.preventDefault();

			if ( 0 !== activeRow ) {
				setFocus( activeRow - 1, activeCol );
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
								<span
									role="textbox"
									tabIndex="0"
									contentEditable="true"
									onKeyPress={ ( event ) => { // ignore: jsx-a11y/no-noninteractive-element-interactions
										event.preventDefault();
									} }
								>&nbsp;
								</span>
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
											onClick={ () => clearTimeout( blurTimeout ) }
										/>
									) }
									<span
										contentEditable="true"
										onFocus={ () => this.updateActiveCell( 0, index + 1 ) }
										onChange={ ( event ) => updateDatasetLabel( event.target.value, index ) }
										className={ index > getDatasetLabels().indexOf( dataset.label ) || '' === dataset.label ? 'input-error' : '' }
									>
										{ dataset.label }
									</span>
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
											onClick={ () => clearTimeout( blurTimeout ) }
										/>
									) }
									<span
										contentEditable="true"
										onFocus={ () => this.updateActiveCell( row + 1, 0 ) }
										onChange={ ( event ) => updateLabel( event.target.value, row ) }
									>
										{ label }
									</span>
								</th>
								{ parsedData.datasets.map( ( dataset, index ) => (
									<td key={ `${ row }-${ index }` }>
										<input
											type="number"
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
