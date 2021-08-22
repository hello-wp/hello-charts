/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	RangeControl,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartData, chartSize },
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		function updateCutout( cutout ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].cutout = cutout + '%';
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateChartSize( width ) {
			setAttributes( { chartSize: width } );
		}

		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
				<RangeControl
					label={ __( 'Cutout', 'hello-charts' ) }
					value={ parseInt( parsedData.datasets[ 0 ].cutout ) }
					onChange={ ( cutout ) => updateCutout( cutout ) }
					min={ 0 }
					max={ 90 }
					step={ 10 }
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
