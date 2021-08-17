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

import { CustomColorPalette } from '../../../common/components';
import { colorPalettes } from '../../../common/helpers';

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartOptions, chartData },
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		function updateCutout( cutout ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].cutout = cutout + '%';
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateShowChartBackground( state ) {
			const options = JSON.parse( chartOptions );
			options.showChartBackground = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateColor( color ) {
			if ( ! color ) {
				return;
			}
			const options = JSON.parse( chartOptions );
			options.chartBackgroundColor = color;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function getColor() {
			const options = JSON.parse( chartOptions );
			return options.chartBackgroundColor;
		}

		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
				<ToggleControl
					label={ __( 'Show Chart Background', 'hello-charts' ) }
					checked={
						parsedOptions.showChartBackground
					}
					onChange={ ( state ) => updateShowChartBackground( state ) }
				/>
				{ parsedOptions.showChartBackground && (
					<CustomColorPalette
						label={ __( 'Background Color', 'hello-charts' ) }
						colors={ colorPalettes().themeColors }
						colorValue={ getColor() }
						onChange={ ( color ) => updateColor( color ) }
					/>
				) }
				<RangeControl
					label={ __( 'Cutout', 'hello-charts' ) }
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
