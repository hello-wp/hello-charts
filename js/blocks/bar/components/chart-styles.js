/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	SelectControl,
	ToggleControl,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartOptions },
			setAttributes,
		} = this.props;

		const parsedOptions = JSON.parse( chartOptions );

		function updateIndexAxis( axis ) {
			const options = JSON.parse( chartOptions );
			options.indexAxis = axis;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStacked( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.x.stacked = state;
			options.scales.y.stacked = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
				<SelectControl
					label={ __( 'Bar Direction', 'hello-charts' ) }
					value={ parsedOptions.indexAxis }
					onChange={ ( axis ) => updateIndexAxis( axis ) }
					options={ [
						{ label: __( 'Vertical', 'hello-charts' ), value: 'x' },
						{ label: __( 'Horizontal', 'hello-charts' ), value: 'y' },
					] }
				/>
				<ToggleControl
					label={ __( 'Stack Data Sets', 'hello-charts' ) }
					checked={ parsedOptions.scales.y.stacked }
					onChange={ ( state ) => updateStacked( state ) }
				/>
			</PanelBody>
		);
	}
}
