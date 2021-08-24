/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	PanelRow,
	SelectControl,
	ToggleControl,
	ColorPalette,
	ColorIndicator,
} = wp.components;

import { colorPalettes } from '../../../common/helpers';

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartOptions, chartBackground },
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

		function updateBackgroundColor( color ) {
			setAttributes( { chartBackground: color } );
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
				<PanelRow className="hello-charts-custom-label-with-color-indicator">
					{ __( 'Background Color', 'hello-charts' ) }
					{ !! chartBackground && (
						<ColorIndicator colorValue={ chartBackground } aria-label={ chartBackground } />
					) }
				</PanelRow>
				<ColorPalette
					colors={ colorPalettes().themeColors }
					value={ chartBackground }
					onChange={ ( color ) => updateBackgroundColor( color ) }
					clearable
				/>
			</PanelBody>
		);
	}
}
