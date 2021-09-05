/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	ToggleControl,
	TextControl,
	BaseControl,
	Button,
} = wp.components;

export default class AxisStyles extends Component {
	constructor( props ) {
		super( props );

		const options = JSON.parse( this.props.attributes.chartOptions );
		const parsedData = JSON.parse( this.props.attributes.chartData );

		this.state = {
			ymin: options?.scales?.y?.min || this.getMinValue( parsedData ),
			ymax: options?.scales?.y?.max || this.getMaxValue( parsedData ),
			stepSize: options?.scales?.y?.ticks?.stepSize || 1,
		};
	}

	getMaxValue( parsedData ) {
		const maxValues = parsedData.datasets.map( ( dataset ) => Math.max( ...dataset.data ) );
		const maxValue = Math.max( ...maxValues );
		return Math.round( maxValue );
	}

	getMinValue( parsedData ) {
		const minValues = parsedData.datasets.map( ( dataset ) => Math.min( ...dataset.data ) );
		const minValue = Math.min( ...minValues );
		if ( 0 < minValue ) {
			return 0;
		}
		return Math.floor( minValue );
	}

	componentDidUpdate( prevProps ) {
		const parsedData = JSON.parse( this.props.attributes.chartData );

		if (
			prevProps.editorOpen &&
			! this.props.editorOpen
		) {
			this.setState( {
				ymin: this.getMinValue( parsedData ),
				ymax: this.getMaxValue( parsedData ),
				stepSize: 1,
			} );
			return;
		}

		const options = JSON.parse( this.props.attributes.chartOptions );
		const prevOptions = JSON.parse( prevProps.attributes.chartOptions );

		if (
			undefined !== options.scales?.y?.min &&
			prevOptions.scales?.y?.min !== options.scales?.y?.min
		) {
			this.setState( { ymin: options.scales.y.min } );
		}
		if (
			undefined !== options.scales?.y?.max &&
			prevOptions.scales?.y?.max !== options.scales?.y?.max
		) {
			this.setState( { ymax: options.scales.y.max } );
		}
		if (
			undefined !== options.scales?.y?.ticks?.stepSize &&
			prevOptions.scales?.y?.ticks?.stepSize !== options.scales?.y?.ticks?.stepSize
		) {
			this.setState( { stepSize: options.scales.y.ticks.stepSize } );
		}
	}

	render() {
		const {
			attributes: { autoScale, chartOptions, chartData },
			setAttributes,
		} = this.props;

		const {
			ymin,
			ymax,
			stepSize,
		} = this.state;

		this.getMinValue = this.getMinValue.bind( this );
		this.getMaxValue = this.getMaxValue.bind( this );

		const getMin = this.getMinValue;
		const getMax = this.getMaxValue;

		function updateShowGridLines( state, axis ) {
			const options = JSON.parse( chartOptions );

			if ( 'x' === axis ) {
				options.scales.x.grid.display = state;
			}

			if ( 'y' === axis ) {
				options.scales.y.grid.display = state;
			}

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateAutoScale( state ) {
			const options = JSON.parse( chartOptions );

			if ( ! state ) {
				options.scales.y.min = ymin;
				options.scales.y.max = ymax;
				options.scales.y.ticks.stepSize = stepSize;
			} else {
				delete options.scales.y.min;
				delete options.scales.y.max;
				delete options.scales.y.ticks.stepSize;
			}

			setAttributes( { autoScale: state, chartOptions: JSON.stringify( options ) } );
		}

		function updateMinMax( state, property ) {
			const options = JSON.parse( chartOptions );

			if ( 'ymin' === property && state < options.scales.y.max ) {
				options.scales.y.min = Math.floor( state );
			}

			if ( 'ymax' === property && state > options.scales.y.min ) {
				options.scales.y.max = Math.round( state );
			}

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStepSize( state ) {
			const options = JSON.parse( chartOptions );

			options.scales.y.ticks.stepSize = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function resetScale() {
			const parsedData = JSON.parse( chartData );
			const options = JSON.parse( chartOptions );

			options.scales.y.min = getMin( parsedData );
			options.scales.y.max = getMax( parsedData );
			options.scales.y.ticks.stepSize = 1;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		const parsedOptions = JSON.parse( chartOptions );

		return (
			<PanelBody title={ __( 'Axis Styles', 'hello-charts' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show X Axis Grid Lines', 'hello-charts' ) }
					checked={
						parsedOptions.scales.x.grid.display
					}
					onChange={ ( state ) => updateShowGridLines( state, 'x' ) }
				/>
				<ToggleControl
					label={ __( 'Show Y Axis Grid Lines', 'hello-charts' ) }
					checked={
						parsedOptions.scales.y.grid.display
					}
					onChange={ ( state ) => updateShowGridLines( state, 'y' ) }
				/>
				<ToggleControl
					label={ __( 'Auto Scale', 'hello-charts' ) }
					checked={ autoScale }
					onChange={ ( state ) => updateAutoScale( state ) }
				/>
				{ ! autoScale && (
					<BaseControl className="chart-manual-scale" >
						<TextControl
							type="number"
							label={ __( 'Min', 'hello-charts' ) }
							value={ parsedOptions.scales.y.min }
							onChange={ ( state ) => updateMinMax( state, 'ymin' ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Max', 'hello-charts' ) }
							value={ parsedOptions.scales.y.max }
							onChange={ ( state ) => updateMinMax( state, 'ymax' ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Step Size', 'hello-charts' ) }
							value={ parsedOptions.scales.y.ticks.stepSize }
							min={ 1 }
							onChange={ ( state ) => updateStepSize( state ) }
						/>
						<Button isSmall onClick={ () => resetScale() } >
							{ __( 'Reset', 'hello-charts' ) }
						</Button>
					</BaseControl>
				) }
			</PanelBody>
		);
	}
}
