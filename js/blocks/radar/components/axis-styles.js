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
			rmin: options?.scales?.r?.min || this.getMinValue( parsedData ),
			rmax: options?.scales?.r?.max || this.getMaxValue( parsedData ),
			stepSize: options?.scales?.r?.ticks?.stepSize || 1,
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
				rmin: this.getMinValue( parsedData ),
				rmax: this.getMaxValue( parsedData ),
				stepSize: 1,
			} );
			return;
		}

		const options = JSON.parse( this.props.attributes.chartOptions );
		const prevOptions = JSON.parse( prevProps.attributes.chartOptions );

		if (
			undefined !== options.scales?.r?.min &&
			prevOptions.scales?.r?.min !== options.scales?.r?.min
		) {
			this.setState( { rmin: options.scales.r.min } );
		}
		if (
			undefined !== options.scales?.r?.max &&
			prevOptions.scales?.r?.max !== options.scales?.r?.max
		) {
			this.setState( { rmax: options.scales.r.max } );
		}
		if (
			undefined !== options.scales?.r?.ticks?.stepSize &&
			prevOptions.scales?.r?.ticks?.stepSize !== options.scales?.r?.ticks?.stepSize
		) {
			this.setState( { stepSize: options.scales.r.ticks.stepSize } );
		}
	}

	render() {
		const {
			attributes: { autoScale, chartOptions, chartData },
			setAttributes,
		} = this.props;

		const {
			rmin,
			rmax,
			stepSize,
		} = this.state;

		this.getMinValue = this.getMinValue.bind( this );
		this.getMaxValue = this.getMaxValue.bind( this );

		const getMin = this.getMinValue;
		const getMax = this.getMaxValue;

		function updateShowAngleLines( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.r.angleLines.display = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateShowGridLines( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.r.grid.display = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateShowTicks( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.r.ticks.display = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateShowPointLabels( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.r.pointLabels.display = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateSuggestedMin( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.r.suggestedMin = state ? 0 : null;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateAutoScale( state ) {
			const options = JSON.parse( chartOptions );

			if ( ! state ) {
				options.scales.r.min = rmin;
				options.scales.r.max = rmax;
				options.scales.r.ticks.stepSize = stepSize;
			} else {
				delete options.scales.r.min;
				delete options.scales.r.max;
				delete options.scales.r.ticks.stepSize;
			}

			setAttributes( { autoScale: state, chartOptions: JSON.stringify( options ) } );
		}

		function updateMinMax( state, property ) {
			const options = JSON.parse( chartOptions );

			if ( 'rmin' === property && state < options.scales.r.max ) {
				options.scales.r.min = Math.floor( state );
			}

			if ( 'rmax' === property && state > options.scales.r.min ) {
				options.scales.r.max = Math.round( state );
			}

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStepSize( state ) {
			const options = JSON.parse( chartOptions );

			options.scales.r.ticks.stepSize = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function resetScale() {
			const parsedData = JSON.parse( chartData );
			const options = JSON.parse( chartOptions );

			options.scales.r.min = getMin( parsedData );
			options.scales.r.max = getMax( parsedData );
			options.scales.r.ticks.stepSize = 1;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		const parsedOptions = JSON.parse( chartOptions );

		return (
			<PanelBody title={ __( 'Axis Styles', 'hello-charts' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show Angle Lines', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.angleLines.display
					}
					onChange={ ( state ) => updateShowAngleLines( state ) }
				/>
				<ToggleControl
					label={ __( 'Show Grid Lines', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.grid.display
					}
					onChange={ ( state ) => updateShowGridLines( state ) }
				/>
				<ToggleControl
					label={ __( 'Show Scale Labels', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.ticks.display
					}
					onChange={ ( state ) => updateShowTicks( state ) }
				/>
				<ToggleControl
					label={ __( 'Show Point Labels', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.pointLabels.display
					}
					onChange={ ( state ) => updateShowPointLabels( state ) }
				/>
				<ToggleControl
					label={ __( 'Zero At Centre', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.suggestedMin === 0
					}
					onChange={ ( state ) => updateSuggestedMin( state ) }
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
							value={ parsedOptions.scales.r.min }
							onChange={ ( state ) => updateMinMax( state, 'rmin' ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Max', 'hello-charts' ) }
							value={ parsedOptions.scales.r.max }
							onChange={ ( state ) => updateMinMax( state, 'rmax' ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Step Size', 'hello-charts' ) }
							value={ parsedOptions.scales.r.ticks.stepSize }
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
