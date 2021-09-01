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
} = wp.components;

export default class AxisStyles extends Component {
	constructor( props ) {
		super( props );

		const options = JSON.parse( this.props.attributes.chartOptions );

		this.state = {
			rmin: options.scales.r.min || this.getMinDataPoint(),
			rmax: options.scales.r.max || this.getMaxDataPoint(),
			stepSize: options.scales.r.ticks.stepSize || 2,
		};
	}

	getMaxDataPoint() {
		let maxInDatasets = 0;

		const parsedData = JSON.parse( this.props.attributes.chartData );

		parsedData.datasets.forEach( ( dataset ) => {
			const maxInSet = Math.max( ...dataset.data );
			if ( maxInSet > maxInDatasets ) {
				maxInDatasets = maxInSet;
			}
		} );

		// Rounds up to nearest even number
		return 2 * Math.round( maxInDatasets / 2 );
	}

	getMinDataPoint() {
		let minInDatasets = 0;

		const parsedData = JSON.parse( this.props.attributes.chartData );

		parsedData.datasets.forEach( ( dataset ) => {
			const minInSet = Math.min( ...dataset.data );
			if ( minInSet < minInDatasets ) {
				minInDatasets = minInSet;
			}
		} );

		// Rounds down to nearest even number
		return 2 * Math.floor( minInDatasets / 2 );
	}

	componentWillReceiveProps( nextProps ) {
		const options = JSON.parse( nextProps.attributes.chartOptions );

		if ( options.scales?.r?.min ) {
			this.setState( { rmin: options.scales.r.min } );
		}
		if ( options.scales?.r?.max ) {
			this.setState( { rmax: options.scales.r.max } );
		}
		if ( options.scales?.r?.ticks?.stepSize ) {
			this.setState( { stepSize: options.scales.r.ticks.stepSize } );
		}
	}

	render() {
		const {
			attributes: { autoScale, chartOptions },
			setAttributes,
		} = this.props;

		const {
			rmin,
			rmax,
			stepSize,
		} = this.state;

		const parsedOptions = JSON.parse( chartOptions );

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

		function updateMinMax( state, axis ) {
			const options = JSON.parse( chartOptions );

			if ( 'rmin' === axis ) {
				options.scales.r.min = Math.floor( state );
			}

			if ( 'rmax' === axis ) {
				options.scales.r.max = Math.round( state );
			}

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStepSize( state ) {
			const options = JSON.parse( chartOptions );

			options.scales.r.ticks.stepSize = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		return (
			<PanelBody title={ __( 'Axis Styles', 'hello-charts' ) } initialOpen={ false }>
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
					label={ __( 'Auto Scale', 'hello-charts' ) }
					checked={
						autoScale
					}
					onChange={ ( state ) => updateAutoScale( state, 'r' ) }
				/>
				{ ! autoScale && (
					<BaseControl
						id="chart-manual-scale"
						label={ __( 'R Scale' ) }
					>
						<div className="chart-manual-scale-controls">
							<TextControl
								type="number"
								label={ __( 'Min' ) }
								value={ parsedOptions.scales.r.min }
								onChange={ ( state ) => updateMinMax( state, 'rmin' ) }
							/>
							<TextControl
								type="number"
								label={ __( 'Max' ) }
								value={ parsedOptions.scales.r.max }
								onChange={ ( state ) => updateMinMax( state, 'rmax' ) }
							/>
							<TextControl
								type="number"
								label={ __( 'Step Size' ) }
								value={ parsedOptions.scales.r.ticks.stepSize }
								min={ 1 }
								onChange={ ( state ) => updateStepSize( state ) }
							/>
						</div>
					</BaseControl>
				) }
			</PanelBody>
		);
	}
}
