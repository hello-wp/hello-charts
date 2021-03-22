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
				data.datasets[ index ].showLine = state;
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

		function updateShowGridLines( state, axis ) {
			const options = JSON.parse( chartOptions );

			if ( 'x' === axis ) {
				options.scales.xAxes[ 0 ].gridLines.display = state;
			}

			if ( 'y' === axis ) {
				options.scales.yAxes[ 0 ].gridLines.display = state;
			}

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

		function updateLineTension( tension ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].lineTension = tension;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		return (
			<PanelBody title="Chart Styles" initialOpen={ true }>
				<ToggleControl
					label="Show Line"
					checked={ parsedData.datasets[ 0 ].showLine }
					onChange={ ( state ) => updateShowLine( state ) }
				/>
				<ToggleControl
					label="Show Background"
					checked={ parsedData.datasets[ 0 ].fill }
					onChange={ ( state ) => updateShowBackground( state ) }
				/>
				<ToggleControl
					label="Show X Axis Grid Lines"
					checked={
						parsedOptions.scales.xAxes[ 0 ].gridLines.display
					}
					onChange={ ( state ) => updateShowGridLines( state, 'x' ) }
				/>
				<ToggleControl
					label="Show Y Axis Grid Lines"
					checked={
						parsedOptions.scales.yAxes[ 0 ].gridLines.display
					}
					onChange={ ( state ) => updateShowGridLines( state, 'y' ) }
				/>
				<RangeControl
					label="Point Size"
					value={ parsedData.datasets[ 0 ].pointRadius }
					onChange={ ( radius ) => updatePointRadius( radius ) }
					min={ 0 }
					max={ 10 }
				/>
				<RangeControl
					label="Curve"
					value={ parsedData.datasets[ 0 ].lineTension * 20 }
					onChange={ ( tension ) => updateLineTension( tension / 20 ) }
					min={ 0 }
					max={ 10 }
				/>
			</PanelBody>
		);
	}
}
