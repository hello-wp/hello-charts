/**
 * External components.
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { RichText } = wp.blockEditor;
const {
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	FlexItem,
	PanelBody,
	RangeControl,
	ToggleControl,
} = wp.components;

/**
 * Internal dependencies.
 */
import { CustomColorPalette } from "./index";

export default class DataStyles extends Component {
	constructor( props ) {
		super( props );

		this.themeColors = wp.data.select( 'core/block-editor' ).getSettings().colors;
		this.defaultColors = wp.blockEditor.SETTINGS_DEFAULTS.colors;
		this.niceColors = this.defaultColors.filter(
			( color ) => ! [ 'black', 'white', 'cyan-bluish-gray' ].find( ( boring ) => boring === color.slug )
		);

		this.state = { activeDataset: 0 };
	}

	updateDatasetLabel( text ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const index = this.state.activeDataset;
		data.datasets[ index ].label = text;
		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updateColor( color ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		const borderColor = tinycolor( color );
		const backgroundColor = tinycolor( color );
		const alpha = tinycolor( data.datasets[ dataset ].backgroundColor ).getAlpha();

		backgroundColor.setAlpha( alpha );
		data.datasets[ dataset ].borderColor = borderColor.toHexString();
		data.datasets[ dataset ].pointBackgroundColor = borderColor.toHexString();
		data.datasets[ dataset ].backgroundColor = backgroundColor.toRgbString();

		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updateAlpha( alpha ) {
		const {
			attributes: { chartData },
			setAttributes,
			singleColor,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		if ( singleColor ) {
			const color = tinycolor( data.datasets[ dataset ].backgroundColor );
			color.setAlpha( alpha );
			data.datasets[ dataset ].backgroundColor = color.toRgbString();
		} else {
			data.datasets[ dataset ].backgroundColor.forEach( ( backgroundColor, index ) => {
				const color = tinycolor( backgroundColor );
				color.setAlpha( alpha );
				data.datasets[ dataset ].backgroundColor[ index ] = color.toRgbString();
			} );
		}

		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updateBorderWidth( width ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		data.datasets[ dataset ].borderWidth.forEach( ( borderWidth, index ) => {
			data.datasets[ dataset ].borderWidth[ index ] = width;
		} );

		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	getColor() {
		const { attributes: { chartData }, singleColor } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		if ( singleColor ) {
			return data.datasets[ dataset ].borderColor;
		}

		return data.datasets[ dataset ].borderColor[ 0 ];
	}

	getAlpha() {
		const { attributes: { chartData }, singleColor } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		if ( singleColor ) {
			return tinycolor( data.datasets[ dataset ].backgroundColor ).getAlpha();
		}

		return tinycolor( data.datasets[ dataset ].backgroundColor[ 0 ] ).getAlpha();
	}

	getBorderWidth() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		return data.datasets[ dataset ].borderWidth[ 0 ];
	}

	hasThemeColors() {
		const colorDiff = this.themeColors.filter(
			( themeColor ) => ! this.defaultColors.find( ( defaultColor ) => defaultColor.slug === themeColor.slug )
		);

		if ( ! colorDiff.length ) {
			return false;
		}

		return true;
	}

	render() {
		const {
			attributes: {
				chartData,
				useThemeColors
			},
			clientId,
			setAttributes,
			singleColor,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		if ( ! parsedData.init ) {
			return null;
		}

		return (
			<PanelBody
				title={ __( 'Data Set Styles', 'hello-charts' ) }
				initialOpen={ false }
				className={ 'hello-charts-data-styles' }
			>
				{ this.hasThemeColors() && singleColor && (
					<ToggleControl
						label={ __( 'Use Theme Colors', 'hello-charts' ) }
						checked={ useThemeColors }
						onChange={ () => setAttributes( { useThemeColors: ! useThemeColors } ) }
					/>
				) }
				<Card>
					<CardHeader>
						<Flex className={ 'dataset-styles' }>
							<FlexItem className={ 'dataset-label' }>
								<RichText
									id={ `inspect-chart-dataset-label-${ clientId }` }
									value={ parsedData.datasets[ this.state.activeDataset ].label }
									onChange={ ( text ) => this.updateDatasetLabel( text ) }
								/>
							</FlexItem>
							<FlexItem>
								<Button
									disabled={ 0 === this.state.activeDataset }
									isSmal={ true }
									icon="arrow-left-alt2"
									label={ __( 'Previous Data Set', 'hello-charts' ) }
									onClick={ () => this.setState( { activeDataset: this.state.activeDataset - 1 } ) }
								/>
							</FlexItem>
							<FlexItem className={ 'dataset-pagination-number' }>
								{ this.state.activeDataset + 1 }{ ' / ' }
								{ parsedData.datasets.length }
							</FlexItem>
							<FlexItem>
								<Button
									disabled={ this.state.activeDataset === parsedData.datasets.length - 1 }
									isSmall={ true }
									icon="arrow-right-alt2"
									label={ __( 'Next Data Set', 'hello-charts' ) }
									onClick={ () => this.setState( { activeDataset: this.state.activeDataset + 1 } ) }
								/>
							</FlexItem>
						</Flex>
					</CardHeader>
					<CardBody>
						{ singleColor && (
							<CustomColorPalette
								label={ __( 'Color', 'hello-charts' ) }
								colors={ useThemeColors ? this.themeColors : this.niceColors }
								colorValue={ this.getColor() }
								onChange={ ( color ) => this.updateColor( color ) }
							/>
						) }
						<RangeControl
							label={ __( 'Opacity', 'hello-charts' ) }
							value={ this.getAlpha() }
							onChange={ ( opacity ) => this.updateAlpha( opacity ) }
							min={ 0 }
							max={ 1 }
							step={ 0.1 }
						/>
						<RangeControl
							label={ __( 'Border Width', 'hello-charts' ) }
							value={ this.getBorderWidth() }
							onChange={ ( width ) => this.updateBorderWidth( width ) }
							min={ 0 }
							max={ 12 }
							step={ 1 }
						/>
					</CardBody>
				</Card>
			</PanelBody>
		);
	}
}
