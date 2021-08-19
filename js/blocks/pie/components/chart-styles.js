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
} = wp.components;

import { colorPalettes } from '../../../common/helpers';

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

		function updateColor( color ) {
			setAttributes( { chartBackground: color } );
		}

		return (
			<PanelBody title={ __( 'Chart Styles', 'hello-charts' ) } initialOpen={ true }>
				<RangeControl
					label={ __( 'Cutout', 'hello-charts' ) }
					value={ parseInt( parsedData.datasets[ 0 ].cutout ) }
					onChange={ ( cutout ) => updateCutout( cutout ) }
					min={ 0 }
					max={ 90 }
					step={ 10 }
				/>
				<PanelRow>Background Color</PanelRow>
				<ColorPalette
					colors={ colorPalettes().themeColors }
					value={ chartBackground }
					onChange={ ( color ) => updateColor( color ) }
					clearable
				/>
			</PanelBody>
		);
	}
}
