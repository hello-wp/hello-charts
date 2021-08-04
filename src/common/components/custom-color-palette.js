/**
 * External components.
 */
import tinycolor from 'tinycolor2';
import { check } from '@wordpress/icons';

/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const { ColorPalette } = wp.blockEditor;
const {
	BaseControl,
	ColorIndicator,
	Icon,
} = wp.components;

export default class CustomColorPalette extends Component {
	render() {
		const {
			colorValue,
			colors,
			onChange,
			...additionalProps
		} = this.props;

		function isCustomColor( color ) {
			const matchingColors = colors.filter( ( colorObject ) => colorObject.color === color );

			return ! matchingColors.length;
		}

		function triggerColorPopover( event ) {
			const wrapper = event.target.closest( '.hello-charts-color-picker' );
			const actionButton = wrapper.querySelector( '.components-dropdown button' );
			actionButton.click();
		}

		return (
			<BaseControl
				className={ `hello-charts-color-picker ${ isCustomColor( colorValue ) ? ' has-custom-color' : '' }` }
				{ ...additionalProps }
			>
				<ColorPalette
					value={ colorValue }
					colors={ colors }
					clearable={ false }
					disableCustomColors={ false }
					disableAlpha={ false }
					onChange={ onChange }
				/>
				{ isCustomColor( colorValue ) && (
					<div className="hello-charts-custom-color-indicator">
						<ColorIndicator colorValue={ colorValue } onClick={ triggerColorPopover }>
							<Icon
								icon={ check }
								fill={ tinycolor.mostReadable( colorValue, [ '#000', '#fff' ] ).toHexString() }
							/>
						</ColorIndicator>
					</div>
				) }
			</BaseControl>
		);
	}
}
