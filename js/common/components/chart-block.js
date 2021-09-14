/**
 * External components.
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies.
 */
const { createRef, Component } = wp.element;
const { BlockControls, InspectorControls, RichText } = wp.blockEditor;

/**
 * Internal dependencies.
 */
import {
	AxisStyles,
	ChartStyles,
	ChartFormattingToolbar,
	DataStyles,
	EditDataButton,
	EditDataModal,
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
				showChartTitle,
				chartData,
				title,
			},
			children,
			className,
			hasAxis,
			hasSegments,
			setAttributes,
			titlePlaceholder,
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
						{ showChartTitle && (
							<RichText
								tagName="h3"
								className="chart-title"
								placeholder={ titlePlaceholder }
								value={ title }
								allowedFormats={ [] }
								withoutInteractiveFormatting={ true }
								onChange={ ( value ) => setAttributes( { title: value } ) }
							/>
						) }
						{ ! this.state.editorOpen && ! this.state.refreshChart && (
							<div className="chart" ref={ this.chartWrapperRef }>
								{ children }
							</div>
						) }
						{ this.state.editorOpen && (
							<EditDataModal toggleEditor={ this.toggleEditor } { ...this.props } />
						) }
					</div>
				</div>
				<InspectorControls key="inspector">
					<EditDataButton toggleEditor={ this.toggleEditor } />
					<ChartStyles { ...this.props } />
					{ hasAxis && (
						<AxisStyles { ...this.props } editorOpen={ this.state.editorOpen } />
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
