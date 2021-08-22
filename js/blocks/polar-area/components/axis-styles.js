/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	ToggleControl,
	TextControl,
} = wp.components;

export default class AxisStyles extends Component {
	render() {
		const {
			attributes: { chartOptions, autoScale },
			setAttributes,
		} = this.props;

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
			if ( state ) {
				delete options.scales.r.min;
				delete options.scales.r.max;
				delete options.scales.r.ticks.stepSize;
			}
			setAttributes( { autoScale: state, chartOptions: JSON.stringify( options ) } );
		}

		function updateMinMax( state, axis ) {
			const options = JSON.parse( chartOptions );

			if ( 'rmin' === axis ) {
				if ( isNaN( state ) ) {
					options.scales.r.min = false;
				} else {
					options.scales.r.min = Math.floor( state );
				}
			}

			if ( 'rmax' === axis ) {
				if ( isNaN( state ) ) {
					options.scales.r.max = false;
				} else {
					options.scales.r.max = Math.floor( state );
				}
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
					onChange={ ( state ) => updateAutoScale( state, 'y' ) }
				/>
				{ ! autoScale && (
					<div className="block-editor-image-size-control">
						<p className="block-editor-image-size-control__row">
							{ __( 'R Scale' ) }
						</p>
						<div className="block-editor-image-size-control__row">
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Min' ) }
								value={ parsedOptions.scales.r.min || 1 }
								min={ 0 }
								onChange={
									( state ) => updateMinMax( state, 'rmin' )
								}
							/>
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Max' ) }
								value={ parsedOptions.scales.r.max || 1 }
								min={ 0 }
								onChange={
									( state ) => updateMinMax( state, 'rmax' )
								}
							/>
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Step Size' ) }
								value={ parsedOptions.scales.r.ticks.stepSize || 1 }
								min={ 1 }
								onChange={
									( state ) => updateStepSize( state )
								}
							/>
						</div>
					</div>
				) }
			</PanelBody>
		);
	}
}
