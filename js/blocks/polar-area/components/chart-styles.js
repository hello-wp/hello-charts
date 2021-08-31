/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	BaseControl,
	ColorPalette,
	ColorIndicator,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: { chartBackground },
			setAttributes,
		} = this.props;

		return (
			<PanelBody
				title={ __( 'Chart Styles', 'hello-charts' ) }
				initialOpen={ true }
				className={ 'hello-charts-chart-styles' }
			>
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
