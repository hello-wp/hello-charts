/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const {
	PanelBody,
	ToggleControl,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartOptions },
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

		return (
			<PanelBody title="Chart Styles" initialOpen={ true }>
				<ToggleControl
					label="Show X Axis Grid Lines"
					checked={
						parsedOptions.scales.x.grid.display
					}
					onChange={ ( state ) => updateShowGridLines( state, 'x' ) }
				/>
				<ToggleControl
					label="Show Y Axis Grid Lines"
					checked={
						parsedOptions.scales.y.grid.display
					}
					onChange={ ( state ) => updateShowGridLines( state, 'y' ) }
				/>
			</PanelBody>
		);
	}
}
