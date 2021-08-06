/**
 * WordPress dependencies.
 */
const { createRef, Component } = wp.element;
const { BlockControls, InspectorControls, RichText } = wp.blockEditor;

/**
 * Internal dependencies.
 */
import {
	ChartFormattingToolbar,
	EditDataButton,
	EditDataModal,
	EditDataToolbar,
} from '.';

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
			maybeGenerateData,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		this.state = { editorOpen: false, refreshChart: false };
		this.chartRef = createRef();

		parsedData.init = true;
		parsedOptions.init = true;

		maybeGenerateData( parsedData.datasets );

		setAttributes( {
			blockId: clientId,
			chartData: JSON.stringify( parsedData ),
			chartOptions: JSON.stringify( parsedOptions ),
			chartType,
		} );
	}

	componentDidUpdate() {
		const { current } = this.chartRef;

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

	toggleEditor( event ) {
		event.preventDefault();
		this.setState( { editorOpen: this.state.editorOpen ? false : true } );
	}

	render() {
		const {
			ChartStyles,
			DataStyles,
			attributes: {
				showChartTitle,
				showChartBackground,
				title,
			},
			children,
			className,
			onNewDataset,
			setAttributes,
			titlePlaceholder,
		} = this.props;

		this.toggleEditor = this.toggleEditor.bind( this );
		this.onNewDataset = onNewDataset.bind( this );

		return (
			<>
				<InspectorControls key="inspector">
					<EditDataButton toggleEditor={ this.toggleEditor } />
					<ChartStyles { ...this.props } />
					<DataStyles { ...this.props } />
				</InspectorControls>
				<BlockControls>
					<EditDataToolbar toggleEditor={ this.toggleEditor } />
					<ChartFormattingToolbar { ...this.props } />
				</BlockControls>
				<div className={ className } key="preview">
					<div className={ showChartBackground ? 'wrapper has-chart-background' : 'wrapper' }>
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
							<div className="chart" ref={ this.chartRef }>
								{ children }
							</div>
						) }
						{ this.state.editorOpen && (
							<EditDataModal toggleEditor={ this.toggleEditor } onNewDataset={ this.onNewDataset } { ...this.props } />
						) }
					</div>
				</div>
			</>
		);
	}
}
