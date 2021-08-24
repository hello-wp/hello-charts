/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	ToggleControl,
} = wp.components;

export default class AxisStyles extends Component {
	render() {
		const {
			attributes: { chartOptions },
			setAttributes,
		} = this.props;

		const parsedOptions = JSON.parse( chartOptions );

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
			</PanelBody>
		);
	}
}
