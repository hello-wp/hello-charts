/**
 * External components.
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { createRef, Component } = wp.element;
const { BlockControls, InspectorControls } = wp.blockEditor;
const { Button, Modal } = wp.components;

/**
 * Internal dependencies.
 */
import {
	AxisStyles,
	ChartStyles,
	ChartFormattingToolbar,
	DataStyles,
	EditDataButton,
	EditDataTable,
	EditDataToolbar,
	SegmentStyles,
} from '.';
import { randomColors } from '../helpers';

export default class ChartBlock extends Component {
	constructor( props ) {
		super( props );

		// Setup the attributes
		const {
			attributes: {
				chartData,
				chartOptions,
			},
			chartType,
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		this.state = { editorOpen: false, refreshChart: false };
		this.chartWrapperRef = createRef();

		parsedData.init = true;
		parsedOptions.init = true;

		this.setDefaults( parsedData );

		setAttributes( {
			blockId: clientId,
			chartData: JSON.stringify( parsedData ),
			chartOptions: JSON.stringify( parsedOptions ),
			chartType,
		} );
	}

	componentDidUpdate() {
		const { current } = this.chartWrapperRef;

		if ( this.state.refreshChart ) {
			this.setState( { refreshChart: false } );
		}

		// Force the transform preview to display with a specific height and width.
		if ( current && current.closest( '.block-editor-block-switcher__preview' ) ) {
			this.setPreviewDimensions();
		}
	}

	setPreviewDimensions() {
		const {
			attributes: { chartOptions },
			setAttributes,
		} = this.props;
		const options = JSON.parse( chartOptions );

		if ( false !== options.responsive ) {
			options.responsive = false;

			setAttributes( {
				height: 280,
				width: 450,
				chartOptions: JSON.stringify( options ),
			} );

			this.setState( { refreshChart: true } );
		}
	}

	setDefaults( parsedData ) {
		const {
			setAttributes,
			generateData,
			hasSegments,
			defaultAlpha,
		} = this.props;

		const colors = randomColors( parsedData.datasets.length );

		parsedData.datasets.forEach( ( dataset, index ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = generateData();
			}

			if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
				if ( hasSegments && 0 === index ) {
					const segmentColors = randomColors( dataset.data.length );
					dataset.backgroundColor = [];
					dataset.data.forEach( ( data, segmentIndex ) => {
						const segmentColor = tinycolor( segmentColors[ segmentIndex ] );
						segmentColor.setAlpha( 0.8 );
						dataset.backgroundColor.push( segmentColor.toRgbString() );
					} );
				} else if ( hasSegments ) {
					dataset.backgroundColor = parsedData.datasets[ 0 ].backgroundColor;
				} else {
					const backgroundColor = tinycolor( colors[ index ] );
					const alpha = defaultAlpha ?? 0.8;
					backgroundColor.setAlpha( alpha );
					dataset.backgroundColor = backgroundColor.toRgbString();
				}
			}

			if ( ! dataset.hasOwnProperty( 'borderColor' ) ) {
				if ( hasSegments ) {
					dataset.borderColor = [];
					dataset.data.forEach( ( data, segmentIndex ) => {
						const color = tinycolor( dataset.backgroundColor[ segmentIndex ] );
						dataset.borderColor.push( color.toHexString() );
					} );
				} else {
					const color = tinycolor( dataset.backgroundColor );
					dataset.borderColor = color.toHexString();
				}
			}

			if ( ! dataset.hasOwnProperty( 'pointBackgroundColor' ) ) {
				dataset.pointBackgroundColor = dataset.borderColor;
			}

			if ( ! dataset.hasOwnProperty( 'borderWidth' ) ) {
				dataset.borderWidth = 2;
			}

			if ( ! dataset.hasOwnProperty( 'borderAlign' ) ) {
				dataset.borderAlign = 'inner';
			}
		} );

		setAttributes( { chartData: JSON.stringify( parsedData ) } );
	}

	toggleEditor( event ) {
		event.preventDefault();
		this.setState( { editorOpen: ! this.state.editorOpen } );
	}

	render() {
		const {
			attributes: {
				backgroundColor,
				chartData,
			},
			children,
			className,
			hasAxis,
			hasSegments,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		if ( ! parsedData.init ) {
			return '';
		}

		const styles = {
			background: backgroundColor ? backgroundColor : 'none',
		};

		this.toggleEditor = this.toggleEditor.bind( this );

		return (
			<>
				<div className={ className } key="preview">
					<div className="wrapper" style={ styles }>
						{ ! this.state.editorOpen && ! this.state.refreshChart && (
							<div className="chart" ref={ this.chartWrapperRef }>
								{ children }
							</div>
						) }
						{ this.state.editorOpen && (
							<Modal
								title={ (
									<>
										{ __( 'Edit Chart Data', 'hello-charts' ) }
										<Button isPrimary className="data-editor-done" onClick={ this.toggleEditor }>{ __( 'Done', 'hello-charts' ) }</Button>
									</>
								) }
								className="hello-charts-data-editor"
								onRequestClose={ this.toggleEditor }
								shouldCloseOnClickOutside={ true }
								isDismissible={ false }
							>
								<EditDataTable { ...this.props } />
							</Modal>
						) }
					</div>
				</div>
				<InspectorControls key="inspector">
					<EditDataButton toggleEditor={ this.toggleEditor } />
					<ChartStyles { ...this.props } />
					{ hasAxis && (
						<AxisStyles { ...this.props } />
					) }
					<DataStyles { ...this.props } />
					{ hasSegments && (
						<SegmentStyles { ...this.props } />
					) }
				</InspectorControls>
				<BlockControls>
					<EditDataToolbar toggleEditor={ this.toggleEditor } />
					<ChartFormattingToolbar { ...this.props } />
				</BlockControls>
			</>
		);
	}
}
