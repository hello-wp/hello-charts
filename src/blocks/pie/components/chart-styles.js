/**
 * WordPress dependencies.
 */
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

		function updateCutout( cutout ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].cutout = cutout + '%';
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		return (
			<PanelBody title="Chart Styles" initialOpen={ true }>
				<RangeControl
					label="Cutout"
					value={ parseInt( parsedData.datasets[ 0 ].cutout ) }
					onChange={ ( cutout ) => updateCutout( cutout ) }
					min={ 0 }
					max={ 90 }
					step={ 10 }
				/>
			</PanelBody>
		);
	}
}
