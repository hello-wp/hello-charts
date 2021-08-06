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
	ToggleControl,
} = wp.components;

/**
 * Internal dependencies.
 */
import { CustomColorPalette } from '.';

export default class SegmentStyles extends Component {
	constructor( props ) {
		super( props );

		this.themeColors = wp.data.select( 'core/block-editor' ).getSettings().colors;
		this.defaultColors = wp.blockEditor.SETTINGS_DEFAULTS.colors;
		this.niceColors = this.defaultColors.filter(
			( color ) => ! [ 'black', 'white', 'cyan-bluish-gray' ].find( ( boring ) => boring === color.slug )
		);

		this.state = { activeSegment: 0 };
	}

	updateSegmentLabel( text ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const index = this.state.activeSegment;
		data.labels[ index ] = text;
		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updateColor( color ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const segment = this.state.activeSegment;

		const borderColor = tinycolor( color );
		const backgroundColor = tinycolor( color );

		data.datasets.forEach( ( dataset, index ) => {
			const alpha = tinycolor( data.datasets[ index ].backgroundColor[ segment ] ).getAlpha();
			backgroundColor.setAlpha( alpha );
			data.datasets[ index ].borderColor[ segment ] = borderColor.toHexString();
			data.datasets[ index ].backgroundColor[ segment ] = backgroundColor.toRgbString();
		} );

		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	getColor() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const segment = this.state.activeSegment;

		return data.datasets[ 0 ].borderColor[ segment ];
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
		} = this.props;

		const parsedData = JSON.parse( chartData );

		if ( ! parsedData.init ) {
			return null;
		}

		return (
			<PanelBody
				title={ __( 'Segment Styles', 'hello-charts' ) }
				initialOpen={ false }
				className={ 'hello-charts-segment-styles' }
			>
				{ this.hasThemeColors() && (
					<ToggleControl
						label={ __( 'Use Theme Colors', 'hello-charts' ) }
						checked={ useThemeColors }
						onChange={ () => setAttributes( { useThemeColors: ! useThemeColors } ) }
					/>
				) }
				<Card>
					<CardHeader>
						<Flex>
							<FlexItem className={ 'segment-label' }>
								<RichText
									id={ `inspect-chart-segment-label-${ clientId }` }
									value={ parsedData.labels[ this.state.activeSegment ] }
									onChange={ ( text ) => this.updateSegmentLabel( text ) }
								/>
							</FlexItem>
							<FlexItem>
								<Button
									disabled={ 0 === this.state.activeSegment }
									isSmal={ true }
									icon="arrow-left-alt2"
									label={ __( 'Previous Segment', 'hello-charts' ) }
									onClick={ () => this.setState( { activeSegment: this.state.activeSegment - 1 } ) }
								/>
							</FlexItem>
							<FlexItem className={ 'dataset-pagination-number' }>
								{ this.state.activeSegment + 1 }{ ' / ' }
								{ parsedData.labels.length }
							</FlexItem>
							<FlexItem>
								<Button
									disabled={ this.state.activeSegment === parsedData.labels.length - 1 }
									isSmall={ true }
									icon="arrow-right-alt2"
									label={ __( 'Next Data Set', 'hello-charts' ) }
									onClick={ () => this.setState( { activeSegment: this.state.activeSegment + 1 } ) }
								/>
							</FlexItem>
						</Flex>
					</CardHeader>
					<CardBody>
						<CustomColorPalette
							label={ __( 'Color', 'hello-charts' ) }
							colors={ useThemeColors ? this.themeColors : this.niceColors }
							colorValue={ this.getColor() }
							onChange={ ( color ) => this.updateColor( color ) }
						/>
					</CardBody>
				</Card>
			</PanelBody>
		);
	}
}
