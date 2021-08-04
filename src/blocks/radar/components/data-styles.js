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
	FlexBlock,
	PanelBody,
	SelectControl,
	ToggleControl,
} = wp.components;

/**
 * Internal dependencies.
 */
import { CustomColorPalette } from '../../../common/components';
import { hex2rgba } from '../../../common/helpers';

export default class DataStyles extends Component {
	constructor( props ) {
		super( props );

		this.state = { activeDataset: 0 };
	}

	render() {
		const {
			attributes: { chartData, useThemeColors },
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const themeColors = wp.data.select( 'core/block-editor' ).getSettings().colors;
		const defaultColors = wp.blockEditor.SETTINGS_DEFAULTS.colors;
		const niceColors = defaultColors.filter(
			( color ) => ! [ 'black', 'white', 'cyan-bluish-gray' ].find( ( boring ) => boring === color.slug )
		);

		function updateDatasetLabel( text, index ) {
			const data = JSON.parse( chartData );
			data.datasets[ index ].label = text;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateDatasetColor( color, index ) {
			const data = JSON.parse( chartData );
			data.datasets[ index ].borderColor = color;
			data.datasets[ index ].pointBackgroundColor = color;
			data.datasets[ index ].backgroundColor = hex2rgba( color, 0.6 );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateDatasetPointStyle( style, index ) {
			const data = JSON.parse( chartData );
			data.datasets[ index ].pointStyle = style;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function hasThemeColors() {
			const colorDiff = themeColors.filter(
				( themeColor ) => ! defaultColors.find( ( defaultColor ) => defaultColor.slug === themeColor.slug )
			);

			if ( ! colorDiff.length ) {
				return false;
			}

			return true;
		}

		return (
			<PanelBody title={ __( 'Data Styles', 'hello-charts' ) } initialOpen={ false }>
				{ hasThemeColors() && (
					<ToggleControl
						label={ __( 'Use Theme Colors', 'hello-charts' ) }
						checked={ useThemeColors }
						onChange={ () => setAttributes( { useThemeColors: useThemeColors ? false : true } ) }
					/>
				) }
				<Card>
					<CardHeader>
						<Flex>
							<FlexBlock>
								<RichText
									value={ parsedData.datasets[ this.state.activeDataset ].label }
									onChange={ ( text ) => updateDatasetLabel( text, this.state.activeDataset ) }
								/>
							</FlexBlock>
						</Flex>
					</CardHeader>
					<CardBody>
						<SelectControl
							label={ __( 'Point Styles', 'hello-charts' ) }
							value={ parsedData.datasets[ this.state.activeDataset ].pointStyle }
							options={ [
								{ label: __( 'Circle', 'hello-charts' ), value: 'circle' },
								{ label: __( 'Rectangle', 'hello-charts' ), value: 'rect' },
								{ label: __( 'Rounded Rectangle', 'hello-charts' ), value: 'rectRounded' },
								{ label: __( 'Diamond', 'hello-charts' ), value: 'rectRot' },
								{ label: __( 'Triangle', 'hello-charts' ), value: 'triangle' },
							] }
							onChange={ ( style ) => updateDatasetPointStyle( style, this.state.activeDataset ) }
						/>
						<CustomColorPalette
							label={ __( 'Color', 'hello-charts' ) }
							id={ `inspect-chart-radar-color-${ clientId }` }
							colors={ useThemeColors ? themeColors : niceColors }
							colorValue={ parsedData.datasets[ this.state.activeDataset ].borderColor }
							onChange={ ( color ) => updateDatasetColor( color, this.state.activeDataset ) }
						/>
					</CardBody>
				</Card>
				<Flex>
					<FlexItem>
						<Button
							disabled={ 0 === this.state.activeDataset }
							isSmal={ true }
							icon="arrow-left-alt2"
							label={ __( 'Previous Data Set', 'hello-charts' ) }
							onClick={ () => this.setState( { activeDataset: this.state.activeDataset - 1 } ) }
						/>
					</FlexItem>
					<FlexItem>
						<span>
							{ this.state.activeDataset + 1 }{ ' / ' }
							{ parsedData.datasets.length }
						</span>
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
			</PanelBody>
		);
	}
}
