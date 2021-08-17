/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	ToggleControl,
} = wp.components;

import { CustomColorPalette } from '../../../common/components';
import { colorPalettes } from '../../../common/helpers';

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartOptions },
			setAttributes,
		} = this.props;

		const parsedOptions = JSON.parse( chartOptions );

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
			</PanelBody>
		);
	}
}
