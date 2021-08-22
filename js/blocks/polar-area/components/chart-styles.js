/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	ToggleControl,
	RangeControl,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartOptions, chartSize },
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

		function updateChartSize( width ) {
			setAttributes( { chartSize: width } );
		}

		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
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
				<RangeControl
					label={ __( 'Chart Size', 'hello-charts' ) }
					value={ chartSize }
					onChange={ ( width ) => updateChartSize( width ) }
					min={ 1 }
					max={ window.outerWidth }
					allowReset
					withInputField={ false }
				/>
			</PanelBody>
		);
	}
}
