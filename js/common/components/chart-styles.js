/**
 * External components.
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	BaseControl,
	RangeControl,
	SelectControl,
	ToggleControl,
	ColorPalette,
	ColorIndicator,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: {
				backgroundColor,
				chartData,
				chartOptions,
			},
			supports,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		if ( supports.stacked && parsedData.datasets.length <= 1 ) {
			updateStacked( false );
		}

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

		function updateTension( property, tension ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ][ property ] = tension;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateCutout( cutout ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].cutout = cutout + '%';
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateBackgroundColor( color ) {
			dynamicallyChangeLabelAndAxisColor( color );
			setAttributes( { backgroundColor: color } );
		}

		function dynamicallyChangeLabelAndAxisColor( color ) {
			if ( color ) {
				const newAxisColor = tinycolor.mostReadable( color, [ 'rgba ( 255, 255, 255, 0.1 )', 'rgba ( 0, 0, 0, 0.1 )' ] ).toRgbString();
				const newLabelColor = tinycolor.mostReadable( color, [ 'rgba ( 170, 170, 170, 1 )', 'rgba ( 85, 85, 85, 1 )' ] ).toRgbString();
				parsedOptions.color = newLabelColor;
				if ( parsedOptions.scales ) {
					Object.keys( parsedOptions.scales ).forEach( ( scale ) => {
						parsedOptions.scales[ scale ].grid.color = newAxisColor;
						parsedOptions.scales[ scale ].ticks.color = newLabelColor;

						if ( parsedOptions.scales[ scale ].pointLabels ) {
							parsedOptions.scales[ scale ].pointLabels.color = newLabelColor;
						}
						if ( parsedOptions.scales[ scale ].angleLines ) {
							parsedOptions.scales[ scale ].angleLines.color = newAxisColor;
						}
					} );
				}
			} else {
				delete parsedOptions.color;
				if ( parsedOptions.scales ) {
					Object.keys( parsedOptions.scales ).forEach( ( scale ) => {
						delete parsedOptions.scales[ scale ].grid.color;
						delete parsedOptions.scales[ scale ].ticks.color;

						if ( parsedOptions.scales[ scale ].pointLabels ) {
							delete parsedOptions.scales[ scale ].pointLabels.color;
						}
						if ( parsedOptions.scales[ scale ].angleLines ) {
							delete parsedOptions.scales[ scale ].angleLines.color;
						}
					} );
				}
			}
			setAttributes( { chartOptions: JSON.stringify( parsedOptions ) } );
		}

		return (
			<PanelBody
				title={ __( 'Chart Styles', 'hello-charts' ) }
				initialOpen={ true }
				className={ 'hello-charts-chart-styles' }
			>
				{ supports.indexAxis && (
					<SelectControl
						label={ __( 'Bar Direction', 'hello-charts' ) }
						value={ parsedOptions.indexAxis }
						onChange={ ( axis ) => updateIndexAxis( axis ) }
						options={ [
							{ label: __( 'Vertical', 'hello-charts' ), value: 'x' },
							{ label: __( 'Horizontal', 'hello-charts' ), value: 'y' },
						] }
					/>
				) }
				{ supports.stacked && (
					<ToggleControl
						label={ __( 'Stack Data Sets', 'hello-charts' ) }
						checked={ parsedOptions.scales.y.stacked }
						onChange={ ( state ) => updateStacked( state ) }
						disabled={ parsedData.datasets.length <= 1 }
						help={
							parsedData.datasets.length <= 1 &&
							__( 'Requires two or more data sets.', 'hello-charts' )
						}
					/>
				) }
				{ supports.tension && (
					<RangeControl
						label={ __( 'Curve', 'hello-charts' ) }
						value={ parsedData.datasets[ 0 ][ supports.tension ] * 20 }
						onChange={ ( tension ) => updateTension( supports.tension, tension / 20 ) }
						min={ 0 }
						max={ 10 }
					/>
				) }
				{ supports.cutout && (
					<RangeControl
						label={ __( 'Cutout', 'hello-charts' ) }
						value={ parseInt( parsedData.datasets[ 0 ].cutout ) }
						onChange={ ( cutout ) => updateCutout( cutout ) }
						min={ 0 }
						max={ 90 }
						step={ 10 }
					/>
				) }
				{ supports.backgroundColor && (
					<BaseControl
						id="chart-background-color"
						label={ __( 'Background Color', 'hello-charts' ) }
					>
						{ backgroundColor && (
							<ColorIndicator colorValue={ backgroundColor } aria-label={ backgroundColor } />
						) }
						<ColorPalette
							id="chart-background-color"
							colors={ wp.data.select( 'core/block-editor' ).getSettings().colors }
							value={ backgroundColor }
							onChange={ ( color ) => updateBackgroundColor( color ) }
							clearable
						/>
					</BaseControl>
				) }
			</PanelBody>
		);
	}
}
