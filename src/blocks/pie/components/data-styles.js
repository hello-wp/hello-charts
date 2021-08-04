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
import { CustomColorPalette } from '../../../common/components';
import { randomColors } from '../../../common/helpers';

export default class DataStyles extends Component {
	constructor( props ) {
		super( props );

		this.state = { activeDataset: 0, activeSegment: 0 };
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

		function updateSegmentLabel( text, index ) {
			const data = JSON.parse( chartData );
			data.labels[ index ] = text;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateSegmentColor( color, dataset, segment ) {
			const data = JSON.parse( chartData );
			data.datasets[ dataset ].borderColor[ segment ] = color;
			data.datasets[ dataset ].backgroundColor[ segment ] = color;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function getColor( dataset, segment ) {
			const data = JSON.parse( chartData );

			// If there's no colors at all, return null. We're not properly intialized.
			if ( ! data.datasets[ dataset ].borderColor ) {
				return;
			}

			// If there is no set color, pick one at random.
			if ( ! data.datasets[ dataset ].borderColor[ segment ] ) {
				const color = randomColors( 1 ).shift();
				data.datasets[ dataset ].borderColor[ segment ] = color;
				data.datasets[ dataset ].backgroundColor[ segment ] = color;
				setAttributes( { chartData: JSON.stringify( data ) } );
			}

			return parsedData.datasets[ dataset ].borderColor[ segment ];
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
			<PanelBody
				title={ __( 'Data Styles', 'hello-charts' ) }
				initialOpen={ false }
				className={ 'hello-charts-data-styles' }
			>
				{ hasThemeColors() && (
					<ToggleControl
						label={ __( 'Use Theme Colors', 'hello-charts' ) }
						checked={ useThemeColors }
						onChange={ () => setAttributes( { useThemeColors: useThemeColors ? false : true } ) }
					/>
				) }
				<Card>
					<CardHeader>
						<Flex className={ 'dataset-styles' }>
							<FlexItem className={ 'dataset-label' }>
								<RichText
									id="dataset-label-field"
									value={ parsedData.datasets[ this.state.activeDataset ].label }
									onChange={ ( text ) => updateDatasetLabel( text, this.state.activeDataset ) }
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
					<CardHeader className={ 'segment-indent' }>
						<Flex>
							<FlexItem className={ 'segment-label' }>
								<RichText
									id="segment-label-field"
									value={ parsedData.labels[ this.state.activeSegment ] }
									onChange={ ( text ) => updateSegmentLabel( text, this.state.activeSegment ) }
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
					<CardBody className={ 'segment-indent' }>
						<CustomColorPalette
							label={ __( 'Color', 'hello-charts' ) }
							id={ `inspect-chart-pie-color-${ clientId }` }
							colors={ useThemeColors ? themeColors : niceColors }
							colorValue={ getColor( this.state.activeDataset, this.state.activeSegment ) }
							onChange={ ( color ) => updateSegmentColor( color, this.state.activeDataset, this.state.activeSegment ) }
						/>
					</CardBody>
				</Card>
			</PanelBody>
		);
	}
}
