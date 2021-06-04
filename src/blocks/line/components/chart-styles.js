/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
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

		function updateShowBackground( state, stacked ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				if ( stacked && 0 === index && state ) {
					data.datasets[ index ].fill = 'start';
				} else if ( stacked && state ) {
					data.datasets[ index ].fill = '-1';
				} else {
					data.datasets[ index ].fill = state;
				}
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateStacked( state ) {
			const data = JSON.parse( chartData );
			const options = JSON.parse( chartOptions );
			const showBackground = data.datasets[ 0 ].fill ? true : false;

			options.scales.y.stacked = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
			updateShowBackground( showBackground, state );
		}

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
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
				<ToggleControl
					label={ __( 'Show Line', 'hello-charts' ) }
					checked={ parsedData.datasets[ 0 ].showLine }
					onChange={ ( state ) => updateShowLine( state ) }
				/>
				<ToggleControl
					label={ __( 'Show Background', 'hello-charts' ) }
					checked={ parsedData.datasets[ 0 ].fill }
					onChange={ ( state ) => updateShowBackground( state, parsedOptions.scales.y.stacked ) }
				/>
				<ToggleControl
					label={ __( 'Stack Data Sets', 'hello-charts' ) }
					checked={ parsedOptions.scales.y.stacked }
					onChange={ ( state ) => updateStacked( state ) }
				/>
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
				<RangeControl
					label={ __( 'Point Size', 'hello-charts' ) }
					value={ parsedData.datasets[ 0 ].pointRadius }
					onChange={ ( radius ) => updatePointRadius( radius ) }
					min={ 0 }
					max={ 10 }
				/>
				<RangeControl
					label={ __( 'Curve', 'hello-charts' ) }
					value={ parsedData.datasets[ 0 ].lineTension * 20 }
					onChange={ ( tension ) => updateLineTension( tension / 20 ) }
					min={ 0 }
					max={ 10 }
				/>
			</PanelBody>
		);
	}
}
