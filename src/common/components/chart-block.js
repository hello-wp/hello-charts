/**
 * Components and dependencies.
 */
import {
	ChartFormattingToolbar,
	EditDataButton,
	EditDataModal,
	EditDataToolbar,
	Legend,
} from '.';

/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const { BlockControls, InspectorControls, RichText } = wp.blockEditor;

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

		this.state = { editorOpen: false };

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

	toggleEditor() {
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
					<Legend { ...this.props } />
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
						{ ! this.state.editorOpen && (
							<div className="chart">
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
