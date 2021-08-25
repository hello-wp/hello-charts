/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	PanelRow,
	ColorPalette,
	ColorIndicator,
} = wp.components;

import { colorPalettes } from '../../../common/helpers';

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartBackground },
			setAttributes,
		} = this.props;

		function updateBackgroundColor( color ) {
			setAttributes( { chartBackground: color } );
		}

		return (
			<PanelBody
				title={ __( 'Chart Styles', 'hello-charts' ) }
				initialOpen={ true }
				className={ 'hello-charts-chart-styles' }
			>
				<PanelRow className="chart-background-color">
					{ __( 'Background Color', 'hello-charts' ) }
					{ chartBackground && (
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
