/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	SelectControl,
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

		function updateIndexAxis( axis ) {
			const options = JSON.parse( chartOptions );
			options.indexAxis = axis;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStacked( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.x.stacked = state;
			options.scales.y.stacked = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
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
				<SelectControl
					label={ __( 'Bar Direction', 'hello-charts' ) }
					value={ parsedOptions.indexAxis }
					onChange={ ( axis ) => updateIndexAxis( axis ) }
					options={ [
						{ label: __( 'Vertical', 'hello-charts' ), value: 'x' },
						{ label: __( 'Horizontal', 'hello-charts' ), value: 'y' },
					] }
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
