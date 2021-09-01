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
			ymin: options.scales.y.min || this.getMinDataPoint(),
			ymax: options.scales.y.max || this.getMaxDataPoint(),
			stepSize: options.scales.y.ticks.stepSize || 2,
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

		if ( options.scales?.y?.min ) {
			this.setState( { ymin: options.scales.y.min } );
		}
		if ( options.scales?.y?.max ) {
			this.setState( { ymax: options.scales.y.max } );
		}
		if ( options.scales?.y?.ticks?.stepSize ) {
			this.setState( { stepSize: options.scales.y.ticks.stepSize } );
		}
	}

	render() {
		const {
			attributes: { autoScale, chartOptions },
			setAttributes,
		} = this.props;

		const {
			ymin,
			ymax,
			stepSize,
		} = this.state;

		const parsedOptions = JSON.parse( chartOptions );

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

		function updateMinMax( state, axis ) {
			const options = JSON.parse( chartOptions );

			if ( 'ymin' === axis ) {
				options.scales.y.min = Math.floor( state );
			}

			if ( 'ymax' === axis ) {
				options.scales.y.max = Math.round( state );
			}

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStepSize( state ) {
			const options = JSON.parse( chartOptions );

			options.scales.y.ticks.stepSize = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

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
					checked={
						autoScale
					}
					onChange={ ( state ) => updateAutoScale( state, 'y' ) }
				/>
				{ ! autoScale && (
					<BaseControl
						id="chart-manual-scale"
						label={ __( 'Y Scale' ) }
					>
						<div className="chart-manual-scale-controls">
							<TextControl
								type="number"
								label={ __( 'Min' ) }
								value={ parsedOptions.scales.y.min }
								onChange={ ( state ) => updateMinMax( state, 'ymin' ) }
							/>
							<TextControl
								type="number"
								label={ __( 'Max' ) }
								value={ parsedOptions.scales.y.max }
								onChange={ ( state ) => updateMinMax( state, 'ymax' ) }
							/>
							<TextControl
								type="number"
								label={ __( 'Step Size' ) }
								value={ parsedOptions.scales.y.ticks.stepSize }
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
