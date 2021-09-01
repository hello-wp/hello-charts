/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	BaseControl,
	RangeControl,
	ColorPalette,
	ColorIndicator,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartData, chartBackground },
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
			<PanelBody
				title={ __( 'Chart Styles', 'hello-charts' ) }
				initialOpen={ true }
				className={ 'hello-charts-chart-styles' }
			>
				<RangeControl
					label={ __( 'Curve', 'hello-charts' ) }
					value={ parsedData.datasets[ 0 ].tension * 20 }
					onChange={ ( tension ) => updateTension( tension / 20 ) }
					min={ 0 }
					max={ 10 }
				/>
				<BaseControl
					id="chart-background-color"
					label={ __( 'Background Color', 'hello-charts' ) }
				>
					{ chartBackground && (
						<ColorIndicator colorValue={ chartBackground } aria-label={ chartBackground } />
					) }
					<ColorPalette
						id="chart-background-color"
						colors={ wp.data.select( 'core/block-editor' ).getSettings().colors }
						value={ chartBackground }
						onChange={ ( color ) => setAttributes( { chartBackground: color } ) }
						clearable
					/>
				</BaseControl>
			</PanelBody>
		);
	}
}
