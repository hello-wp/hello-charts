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
			attributes: { chartData, chartOptions },
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

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

		function updateSuggestedMin( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.r.suggestedMin = state ? 0 : null;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateTension( tension ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].tension = tension;
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
					label={ __( 'Show Angle Lines', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.angleLines.display
					}
					onChange={ ( state ) => updateShowAngleLines( state ) }
				/>
				<ToggleControl
					label={ __( 'Show Grid Lines', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.grid.display
					}
					onChange={ ( state ) => updateShowGridLines( state ) }
				/>
				<ToggleControl
					label={ __( 'Show Scale Labels', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.ticks.display
					}
					onChange={ ( state ) => updateShowTicks( state ) }
				/>
				<ToggleControl
					label={ __( 'Show Point Labels', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.pointLabels.display
					}
					onChange={ ( state ) => updateShowPointLabels( state ) }
				/>
				<ToggleControl
					label={ __( 'Zero At Centre', 'hello-charts' ) }
					checked={
						parsedOptions.scales.r.suggestedMin === 0
					}
					onChange={ ( state ) => updateSuggestedMin( state ) }
				/>
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
