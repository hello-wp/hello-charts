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
			options.legend.display = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateLegendPosition( position ) {
			const options = JSON.parse( chartOptions );
			options.legend.position = position;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateLegendAlign( align ) {
			const options = JSON.parse( chartOptions );
			options.legend.align = align;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		return (
			<PanelBody title="Legend" initialOpen={ false }>
				<ToggleControl
					label="Show Legend"
					checked={ parsedOptions.legend.display }
					onChange={ ( state ) => updateShowLegend( state ) }
				/>
				{ parsedOptions.legend.display && (
					<SelectControl
						label="Legend Position"
						value={ parsedOptions.legend.position }
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
				{ parsedOptions.legend.display && (
					<SelectControl
						label="Legend Align"
						value={ parsedOptions.legend.align }
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
