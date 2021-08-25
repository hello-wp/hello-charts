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
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		function updateTension( tension ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].tension = tension;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
				<RangeControl
					label={ __( 'Curve', 'hello-charts' ) }
					value={ parsedData.datasets[ 0 ].tension * 20 }
					onChange={ ( tension ) => updateTension( tension / 20 ) }
					min={ 0 }
					max={ 10 }
				/>
			</PanelBody>
		);
	}
}
