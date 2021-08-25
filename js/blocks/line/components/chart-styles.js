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

		function updateStacked( state ) {
			const data = JSON.parse( chartData );
			const options = JSON.parse( chartOptions );

			options.scales.y.stacked = state;

			data.datasets.forEach( ( dataset, index ) => {
				if ( state && 0 === index ) {
					data.datasets[ index ].fill = 'start';
				} else if ( state ) {
					data.datasets[ index ].fill = '-1';
				} else {
					data.datasets[ index ].fill = true;
				}
			} );

			setAttributes( {
				chartData: JSON.stringify( data ),
				chartOptions: JSON.stringify( options ),
			} );
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
					label={ __( 'Stack Data Sets', 'hello-charts' ) }
					checked={ parsedOptions.scales.y.stacked }
					onChange={ ( state ) => updateStacked( state ) }
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
