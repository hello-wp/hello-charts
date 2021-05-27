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

export default class Legend extends Component {
	render() {
		const {
			attributes: { chartOptions },
			setAttributes,
		} = this.props;

		const parsedOptions = JSON.parse( chartOptions );

		function updateShowLegend( state ) {
			const options = JSON.parse( chartOptions );
			options.plugins.legend.display = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateLegendPosition( position ) {
			const options = JSON.parse( chartOptions );
			options.plugins.legend.position = position;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateLegendAlign( align ) {
			const options = JSON.parse( chartOptions );
			options.plugins.legend.align = align;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		return (
			<PanelBody title={ __( 'Legend', 'hello-charts' ) } initialOpen={ false }>
				<ToggleControl
					label={ __( 'Show Legend', 'hello-charts' ) }
					checked={ parsedOptions.plugins.legend.display }
					onChange={ ( state ) => updateShowLegend( state ) }
				/>
				{ parsedOptions.plugins.legend.display && (
					<SelectControl
						label={ __( 'Legend Position', 'hello-charts' ) }
						value={ parsedOptions.plugins.legend.position }
						options={ [
							{ label: __( 'Top', 'hello-charts' ), value: 'top' },
							{ label: __( 'Left', 'hello-charts' ), value: 'left' },
							{ label: __( 'Bottom', 'hello-charts' ), value: 'bottom' },
							{ label: __( 'Right', 'hello-charts' ), value: 'right' },
						] }
						onChange={ ( position ) =>
							updateLegendPosition( position )
						}
					/>
				) }
				{ parsedOptions.plugins.legend.display && (
					<SelectControl
						label={ __( 'Legend Align', 'hello-charts' ) }
						value={ parsedOptions.plugins.legend.align }
						options={ [
							{ label: __( 'Start', 'hello-charts' ), value: 'start' },
							{ label: __( 'Center', 'hello-charts' ), value: 'center' },
							{ label: __( 'End', 'hello-charts' ), value: 'end' },
						] }
						onChange={ ( align ) => updateLegendAlign( align ) }
					/>
				) }
			</PanelBody>
		);
	}
}
