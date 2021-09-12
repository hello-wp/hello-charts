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
		const scale = this.props.supports.scale;

		this.state = {
			min: options?.scales[ scale ]?.min || this.getMinValue( parsedData ),
			max: options?.scales[ scale ]?.max || this.getMaxValue( parsedData ),
			stepSize: options?.scales[ scale ]?.ticks?.stepSize || 1,
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
				min: this.getMinValue( parsedData ),
				max: this.getMaxValue( parsedData ),
				stepSize: 1,
			} );
			return;
		}

		const options = JSON.parse( this.props.attributes.chartOptions );
		const prevOptions = JSON.parse( prevProps.attributes.chartOptions );
		const scale = this.props.supports.scale;

		if (
			undefined !== options.scales[ scale ]?.min &&
			prevOptions.scales[ scale ]?.min !== options.scales[ scale ]?.min
		) {
			this.setState( { min: options.scales[ scale ].min } );
		}
		if (
			undefined !== options.scales[ scale ]?.max &&
			prevOptions.scales[ scale ]?.max !== options.scales[ scale ]?.max
		) {
			this.setState( { max: options.scales[ scale ].max } );
		}
		if (
			undefined !== options.scales[ scale ]?.ticks?.stepSize &&
			prevOptions.scales[ scale ]?.ticks?.stepSize !== options.scales[ scale ]?.ticks?.stepSize
		) {
			this.setState( { stepSize: options.scales[ scale ].ticks.stepSize } );
		}
	}

	render() {
		const {
			attributes: {
				autoScale,
				chartOptions,
				chartData,
			},
			supports,
			setAttributes,
		} = this.props;

		const {
			min,
			max,
			stepSize,
		} = this.state;

		const getMin = this.getMinValue.bind( this );
		const getMax = this.getMaxValue.bind( this );

		function updateShowAxisProperty( state, axis, property ) {
			const options = JSON.parse( chartOptions );

			options.scales[ axis ][ property ].display = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateAutoScale( state, axis ) {
			const options = JSON.parse( chartOptions );

			if ( ! state ) {
				options.scales[ axis ].min = min;
				options.scales[ axis ].max = max;
				options.scales[ axis ].ticks.stepSize = stepSize;
			} else {
				delete options.scales[ axis ].min;
				delete options.scales[ axis ].max;
				delete options.scales[ axis ].ticks.stepSize;
			}

			setAttributes( { autoScale: state, chartOptions: JSON.stringify( options ) } );
		}

		function updateMinMax( state, axis, property ) {
			const options = JSON.parse( chartOptions );

			if ( 'min' === property && state < options.scales[ axis ].max ) {
				options.scales[ axis ].min = Math.floor( state );
			}

			if ( 'max' === property && state > options.scales[ axis ].min ) {
				options.scales[ axis ].max = Math.round( state );
			}

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStepSize( state, axis ) {
			const options = JSON.parse( chartOptions );

			options.scales[ axis ].ticks.stepSize = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function resetScale( axis ) {
			const parsedData = JSON.parse( chartData );
			const options = JSON.parse( chartOptions );

			options.scales[ axis ].min = getMin( parsedData );
			options.scales[ axis ].max = getMax( parsedData );
			options.scales[ axis ].ticks.stepSize = 1;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		const parsedOptions = JSON.parse( chartOptions );

		return (
			<PanelBody title={ __( 'Axis Styles', 'hello-charts' ) } initialOpen={ false }>
				{ supports.angleLines && (
					<ToggleControl
						label={ __( 'Show Angle Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.angleLines.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'angleLines' ) }
					/>
				) }
				{ supports.xGridDisplay && (
					<ToggleControl
						label={ __( 'Show X Axis Grid Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.x.grid.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'x', 'grid' ) }
					/>
				) }
				{ supports.yGridDisplay && (
					<ToggleControl
						label={ __( 'Show Y Axis Grid Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.y.grid.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'y', 'grid' ) }
					/>
				) }
				{ supports.rGridDisplay && (
					<ToggleControl
						label={ __( 'Show Grid Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.grid.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'grid' ) }
					/>
				) }
				{ supports.ticks && (
					<ToggleControl
						label={ __( 'Show Scale Labels', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.ticks.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'ticks' ) }
					/>
				) }
				{ supports.pointLabels && (
					<ToggleControl
						label={ __( 'Show Point Labels', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.pointLabels.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'pointLabels' ) }
					/>
				) }
				{ supports.scale && (
					<ToggleControl
						label={ __( 'Auto Scale', 'hello-charts' ) }
						checked={ autoScale }
						onChange={ ( state ) => updateAutoScale( state, supports.scale ) }
					/>
				) }
				{ supports.scale && ! autoScale && (
					<BaseControl className="chart-manual-scale" >
						<TextControl
							type="number"
							label={ __( 'Min', 'hello-charts' ) }
							value={ parsedOptions.scales[ supports.scale ].min }
							onChange={ ( state ) => updateMinMax( state, supports.scale, 'min' ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Max', 'hello-charts' ) }
							value={ parsedOptions.scales[ supports.scale ].max }
							onChange={ ( state ) => updateMinMax( state, supports.scale, 'max' ) }
						/>
						<TextControl
							type="number"
							label={ __( 'Step Size', 'hello-charts' ) }
							value={ parsedOptions.scales[ supports.scale ].ticks.stepSize }
							min={ 1 }
							onChange={ ( state ) => updateStepSize( state, supports.scale ) }
						/>
						<Button isSmall onClick={ () => resetScale( supports.scale ) }>
							{ __( 'Reset', 'hello-charts' ) }
						</Button>
					</BaseControl>
				) }
			</PanelBody>
		);
	}
}
