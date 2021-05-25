/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const {
	PanelBody,
	RangeControl,
	ToggleControl,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartData, chartOptions },
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		function updateShowLine( state ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].borderWidth = state ? 3 : 0;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateShowBackground( state ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].fill = state;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

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

		function updatePointRadius( radius ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].pointRadius = radius;
				data.datasets[ index ].hoverRadius = radius;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateTension( tension ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].tension = tension;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		return (
			<PanelBody title="Chart Styles" initialOpen={ true }>
				<ToggleControl
					label="Show Line"
					checked={ parsedData.datasets[ 0 ].borderWidth > 0 }
					onChange={ ( state ) => updateShowLine( state ) }
				/>
				<ToggleControl
					label="Show Background"
					checked={ parsedData.datasets[ 0 ].fill }
					onChange={ ( state ) => updateShowBackground( state ) }
				/>
				<ToggleControl
					label="Show Angle Lines"
					checked={
						parsedOptions.scales.r.angleLines.display
					}
					onChange={ ( state ) => updateShowAngleLines( state ) }
				/>
				<ToggleControl
					label="Show Grid Lines"
					checked={
						parsedOptions.scales.r.grid.display
					}
					onChange={ ( state ) => updateShowGridLines( state ) }
				/>
				<ToggleControl
					label="Show Scale Labels"
					checked={
						parsedOptions.scales.r.ticks.display
					}
					onChange={ ( state ) => updateShowTicks( state ) }
				/>
				<ToggleControl
					label="Show Point Labels"
					checked={
						parsedOptions.scales.r.pointLabels.display
					}
					onChange={ ( state ) => updateShowPointLabels( state ) }
				/>
				<RangeControl
					label="Point Size"
					value={ parsedData.datasets[ 0 ].pointRadius }
					onChange={ ( radius ) => updatePointRadius( radius ) }
					min={ 0 }
					max={ 10 }
				/>
				{ ( parsedData.datasets[ 0 ].borderWidth > 0 ||
					parsedData.datasets[ 0 ].fill ) && (
					<RangeControl
						label="Curve"
						value={ parsedData.datasets[ 0 ].tension * 20 }
						onChange={ ( tension ) => updateTension( tension / 20 ) }
						min={ 0 }
						max={ 10 }
					/>
				) }
			</PanelBody>
		);
	}
}