/**
 * WordPress dependencies.
 */
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
			<PanelBody title="Legend" initialOpen={ false }>
				<ToggleControl
					label="Show Legend"
					checked={ parsedOptions.plugins.legend.display }
					onChange={ ( state ) => updateShowLegend( state ) }
				/>
				{ parsedOptions.plugins.legend.display && (
					<SelectControl
						label="Legend Position"
						value={ parsedOptions.plugins.legend.position }
						options={ [
							{ label: 'Top', value: 'top' },
							{ label: 'Left', value: 'left' },
							{ label: 'Bottom', value: 'bottom' },
							{ label: 'Right', value: 'right' },
						] }
						onChange={ ( position ) =>
							updateLegendPosition( position )
						}
					/>
				) }
				{ parsedOptions.plugins.legend.display && (
					<SelectControl
						label="Legend Align"
						value={ parsedOptions.plugins.legend.align }
						options={ [
							{ label: 'Start', value: 'start' },
							{ label: 'Center', value: 'center' },
							{ label: 'End', value: 'end' },
						] }
						onChange={ ( align ) => updateLegendAlign( align ) }
					/>
				) }
			</PanelBody>
		);
	}
}
