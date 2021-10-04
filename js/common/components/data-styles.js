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
	SelectControl,
	ToggleControl,
} = wp.components;

/**
 * Internal dependencies.
 */
import { CustomColorPalette } from '.';
import { colorPalettes } from '../helpers';

export default class DataStyles extends Component {
	constructor( props ) {
		super( props );

		this.colorPalettes = colorPalettes();

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

		if ( ! color ) {
			return;
		}

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		data.datasets[ dataset ].borderColor = color;
		data.datasets[ dataset ].pointBackgroundColor = color;

		const alpha = tinycolor( data.datasets[ dataset ].backgroundColor ).getAlpha();

		data.datasets[ dataset ].backgroundColor = tinycolor( color ).setAlpha( alpha ).toRgbString();

		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updateAlpha( alpha ) {
		const {
			attributes: { chartData },
			setAttributes,
			hasSegments,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		if ( hasSegments ) {
			data.datasets[ dataset ].backgroundColor.forEach( ( backgroundColor, index ) => {
				const color = tinycolor( backgroundColor );
				color.setAlpha( alpha );
				data.datasets[ dataset ].backgroundColor[ index ] = color.toRgbString();
			} );
		} else {
			const color = tinycolor( data.datasets[ dataset ].backgroundColor );
			color.setAlpha( alpha );
			data.datasets[ dataset ].backgroundColor = color.toRgbString();
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

		data.datasets[ dataset ].borderWidth = width;

		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updatePointRadius( radius ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		data.datasets[ dataset ].pointRadius = radius;
		data.datasets[ dataset ].hoverRadius = radius;
		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updatePointStyle( style ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		data.datasets[ dataset ].pointStyle = style;
		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updateDashLength( length ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		const space = data.datasets[ dataset ].borderDash[ 1 ];

		data.datasets[ dataset ].borderDash = [ length, space ];
		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	updateDashSpacing( space ) {
		const {
			attributes: { chartData },
			setAttributes,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		const length = data.datasets[ dataset ].borderDash[ 0 ];

		data.datasets[ dataset ].borderDash = [ length, space ];
		setAttributes( { chartData: JSON.stringify( data ) } );
	}

	getColor() {
		const {
			attributes: { chartData },
			hasSegments,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		if ( hasSegments ) {
			return data.datasets[ dataset ].borderColor[ 0 ];
		}

		return data.datasets[ dataset ].borderColor;
	}

	getAlpha() {
		const {
			attributes: { chartData },
			hasSegments,
		} = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		if ( hasSegments ) {
			return tinycolor( data.datasets[ dataset ].backgroundColor[ 0 ] ).getAlpha();
		}

		return tinycolor( data.datasets[ dataset ].backgroundColor ).getAlpha();
	}

	getBorderWidth() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		return data.datasets[ dataset ].borderWidth;
	}

	getPointRadius() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		return data.datasets[ dataset ].pointRadius;
	}

	getPointStyle() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		return data.datasets[ dataset ].pointStyle;
	}

	getDashLength() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		return data.datasets[ dataset ].borderDash[ 0 ];
	}

	getDashSpacing() {
		const { attributes: { chartData } } = this.props;

		const data = JSON.parse( chartData );
		const dataset = this.state.activeDataset;

		return data.datasets[ dataset ].borderDash[ 1 ];
	}

	render() {
		const {
			attributes: {
				chartData,
				useThemeColors,
			},
			clientId,
			setAttributes,
			hasSegments,
			hasPoints,
			hasLineStyling,
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
				{ this.colorPalettes.hasThemeColorPalette && ! hasSegments && (
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
						{ ! hasSegments && (
							<CustomColorPalette
								label={ __( 'Color', 'hello-charts' ) }
								colors={ useThemeColors ? this.colorPalettes.themeColors : this.colorPalettes.niceColors }
								colorValue={ this.getColor() }
								onChange={ ( color ) => this.updateColor( color ) }
							/>
						) }
						<RangeControl
							label={ __( 'Background Opacity', 'hello-charts' ) }
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
						{ hasPoints && (
							<RangeControl
								label={ __( 'Point Size', 'hello-charts' ) }
								value={ this.getPointRadius() }
								onChange={ ( radius ) => this.updatePointRadius( radius ) }
								min={ 0 }
								max={ 12 }
								step={ 1 }
							/>
						) }
						{ hasPoints && (
							<SelectControl
								label={ __( 'Point Style', 'hello-charts' ) }
								value={ this.getPointStyle() }
								options={ [
									{ label: __( 'Circle', 'hello-charts' ), value: 'circle' },
									{ label: __( 'Rectangle', 'hello-charts' ), value: 'rect' },
									{ label: __( 'Rounded Rectangle', 'hello-charts' ), value: 'rectRounded' },
									{ label: __( 'Diamond', 'hello-charts' ), value: 'rectRot' },
									{ label: __( 'Triangle', 'hello-charts' ), value: 'triangle' },
								] }
								onChange={ ( style ) => this.updatePointStyle( style ) }
							/>
						) }
						{ hasLineStyling && (
							<>
								<RangeControl
									label={ __( 'Dash Length', 'hello-charts' ) }
									value={ this.getDashLength() }
									onChange={ ( length ) => this.updateDashLength( length ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
								<RangeControl
									label={ __( 'Dash Spacing', 'hello-charts' ) }
									value={ this.getDashSpacing() }
									onChange={ ( space ) => this.updateDashSpacing( space ) }
									min={ 0 }
									max={ 20 }
									step={ 1 }
								/>
							</>
						) }
					</CardBody>
				</Card>
			</PanelBody>
		);
	}
}
