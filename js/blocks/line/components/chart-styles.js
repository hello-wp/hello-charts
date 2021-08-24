/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	PanelRow,
	RangeControl,
	ToggleControl,
	ColorPalette,
	ColorIndicator,
} = wp.components;

import { colorPalettes } from '../../../common/helpers';

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartData, chartOptions, chartBackground },
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		function updateStacked( state ) {
			const data = JSON.parse( chartData );
			const options = JSON.parse( chartOptions );

			options.scales.y.stacked = state;

			data.datasets.forEach( ( dataset, index ) => {
				if ( state && 0 === index ) {
					data.datasets[ index ].fill = 'start';
				} else if ( state ) {
					data.datasets[ index ].fill = '-1';
				} else {
					data.datasets[ index ].fill = true;
				}
			} );

			setAttributes( {
				chartData: JSON.stringify( data ),
				chartOptions: JSON.stringify( options ),
			} );
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

		function updateLineTension( tension ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].lineTension = tension;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateBackgroundColor( color ) {
			setAttributes( { chartBackground: color } );
		}

		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
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
				<RangeControl
					label={ __( 'Curve', 'hello-charts' ) }
					value={ parsedData.datasets[ 0 ].lineTension * 20 }
					onChange={ ( tension ) => updateLineTension( tension / 20 ) }
					min={ 0 }
					max={ 10 }
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
