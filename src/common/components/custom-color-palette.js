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
	isCustomColor( color ) {
		const colors = wp.data.select( 'core/block-editor' ).getSettings().colors;
		const matchingColors = colors.filter( ( colorObject ) => colorObject.color === color );

		return ! matchingColors.length;
	}

	render() {
		const {
			colorValue,
			onChange,
			...additionalProps
		} = this.props;

		return (
			<BaseControl
				className={ `hello-charts-color-picker ${ this.isCustomColor( colorValue ) ? ' has-custom-color' : '' }` }
				{ ...additionalProps }
			>
				<ColorPalette
					value={ colorValue }
					clearable={ false }
					disableCustomColors={ false }
					onChange={ onChange }
				/>
				{ this.isCustomColor( colorValue ) && (
					<div className="hello-charts-custom-color-indicator">
						<ColorIndicator colorValue={ colorValue }>
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
