/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	PanelRow,
	RangeControl,
	ColorPalette,
	ColorIndicator,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartBackground, chartData },
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

		function updateBackgroundColor( color ) {
			setAttributes( { chartBackground: color } );
		}

		return (
			<PanelBody
				title={ __( 'Chart Styles', 'hello-charts' ) }
				initialOpen={ true }
				className={ 'hello-charts-chart-styles' }
			>
				<RangeControl
					label={ __( 'Cutout', 'hello-charts' ) }
					value={ parseInt( parsedData.datasets[ 0 ].cutout ) }
					onChange={ ( cutout ) => updateCutout( cutout ) }
					min={ 0 }
					max={ 90 }
					step={ 10 }
				/>
				<PanelRow className="chart-background-color">
					{ __( 'Background Color', 'hello-charts' ) }
					{ chartBackground && (
						<ColorIndicator colorValue={ chartBackground } aria-label={ chartBackground } />
					) }
				</PanelRow>
				<ColorPalette
					colors={ wp.data.select( 'core/block-editor' ).getSettings().colors }
					value={ chartBackground }
					onChange={ ( color ) => updateBackgroundColor( color ) }
					clearable
				/>
			</PanelBody>
		);
	}
}
