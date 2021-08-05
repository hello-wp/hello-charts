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
	BaseControl,
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
import { CustomColorPalette } from '../../../common/components';

export default class DataStyles extends Component {
	constructor( props ) {
		super( props );

		this.themeColors = wp.data.select( 'core/block-editor' ).getSettings().colors;
		this.defaultColors = wp.blockEditor.SETTINGS_DEFAULTS.colors;
		this.niceColors = this.defaultColors.filter(
			( color ) => ! [ 'black', 'white', 'cyan-bluish-gray' ].find( ( boring ) => boring === color.slug )
		);

		this.state = { activeDataset: 0, activeSegment: 0 };
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

	updateAlpha( alpha ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		data.datasets[ dataset ].backgroundColor.forEach( ( backgroundColor, index ) => {
			const color = tinycolor( backgroundColor );
			color.setAlpha( alpha );
			data.datasets[ dataset ].backgroundColor[ index ] = color.toRgbString();
		} );

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

	getAlpha() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		const color = tinycolor( data.datasets[ dataset ].backgroundColor[ 0 ] );
		return color.getAlpha();
	}

	getBorderWidth() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		return data.datasets[ dataset ].borderWidth[ 0 ];
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
			attributes: { chartData, useThemeColors },
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );

		if ( ! parsedData.init ) {
			return null;
		}

		return (
			<PanelBody
				title={ __( 'Data Styles', 'hello-charts' ) }
				initialOpen={ false }
				className={ 'hello-charts-data-styles' }
			>
				{ this.hasThemeColors() && (
					<ToggleControl
						label={ __( 'Use Theme Colors', 'hello-charts' ) }
						checked={ useThemeColors }
						onChange={ () => setAttributes( { useThemeColors: ! useThemeColors } ) }
					/>
				) }
				<BaseControl
					label={ __( 'Data Set Styles', 'hello-charts' ) }
					id={ `inspect-chart-dataset-label-${ clientId }` }
				>
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
				</BaseControl>
				<BaseControl
					label={ __( 'Segment Styles', 'hello-charts' ) }
					id={ `inspect-chart-segment-label-${ clientId }` }
				>
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
				</BaseControl>
			</PanelBody>
		);
	}
}
