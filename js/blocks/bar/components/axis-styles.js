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
			if ( state ) {
				delete options.scales.x.min;
				delete options.scales.x.max;
				delete options.scales.y.min;
				delete options.scales.y.max;
				delete options.scales.y.ticks.stepSize;
			}
			setAttributes( { autoScale: state, chartOptions: JSON.stringify( options ) } );
		}

		function updateMinMax( state, axis ) {
			const options = JSON.parse( chartOptions );

			if ( 'xmin' === axis ) {
				if ( isNaN( state ) ) {
					options.scales.x.min = false;
				} else {
					options.scales.x.min = Math.floor( state );
				}
			}

			if ( 'ymin' === axis ) {
				if ( isNaN( state ) ) {
					delete options.scales.y.min;
				} else {
					options.scales.y.min = Math.floor( state );
				}
			}

			if ( 'xmax' === axis ) {
				if ( isNaN( state ) ) {
					options.scales.x.max = false;
				} else {
					options.scales.x.max = Math.floor( state );
				}
			}

			if ( 'ymax' === axis ) {
				if ( isNaN( state ) ) {
					delete options.scales.y.max;
				} else {
					options.scales.y.max = Math.floor( state );
				}
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
					<div className="block-editor-image-size-control">
						<p className="block-editor-image-size-control__row">
							{ __( 'X Scale' ) }
						</p>
						<div className="block-editor-image-size-control__row">
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Min' ) }
								value={ parsedOptions.scales.x.min || 1 }
								min={ 0 }
								onChange={
									( state ) => updateMinMax( state, 'xmin' )
								}
							/>
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Max' ) }
								value={ parsedOptions.scales.x.max || 1 }
								min={ 0 }
								onChange={
									( state ) => updateMinMax( state, 'xmax' )
								}
							/>
						</div>
						<p className="block-editor-image-size-control__row">
							{ __( 'Y Scale' ) }
						</p>
						<div className="block-editor-image-size-control__row">
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Min' ) }
								value={ parsedOptions.scales.y.min || 1 }
								min={ 0 }
								onChange={
									( state ) => updateMinMax( state, 'ymin' )
								}
							/>
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Max' ) }
								value={ parsedOptions.scales.y.max || 1 }
								min={ 0 }
								onChange={
									( state ) => updateMinMax( state, 'ymax' )
								}
							/>
							<TextControl
								type="number"
								className="block-editor-image-size-control__width"
								label={ __( 'Step Size' ) }
								value={ parsedOptions.scales.y.ticks.stepSize || 1 }
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
