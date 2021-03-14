/**
 * WordPress dependencies.
 */
const { Component } = wp.element;
const { ColorPalette, RichText } = wp.blockEditor;
const {
	BaseControl,
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	FlexItem,
	FlexBlock,
	PanelBody,
	SelectControl,
} = wp.components;

/**
 * Components and dependencies.
 */
import { hex2rgba } from '../../../common/helpers';

export default class DataStyles extends Component {
	render() {
		const {
			attributes: {
				activeDatasetIndex,
				chartData,
			},
			clientId,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );

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

		function incrementActiveDataset() {
			setAttributes( { activeDatasetIndex: activeDatasetIndex + 1 } );
		}

		function decrementActiveDataset() {
			setAttributes( { activeDatasetIndex: activeDatasetIndex - 1 } );
		}

		return (
			<PanelBody title="Data Styles" initialOpen={ false }>
				<Card>
					<CardHeader>
						<Flex>
							<FlexBlock>
								<RichText
									value={ parsedData.datasets[ activeDatasetIndex ].label }
									onChange={ ( text ) => updateDatasetLabel( text, activeDatasetIndex ) }
								/>
							</FlexBlock>
						</Flex>
					</CardHeader>
					{ ( parsedData.datasets[ activeDatasetIndex ].pointRadius > 0 ||
						parsedData.datasets[ activeDatasetIndex ].showLine ) && (
						<CardBody>
							{ parsedData.datasets[ activeDatasetIndex ].pointRadius > 0 && (
								<SelectControl
									label="Point Style"
									value={ parsedData.datasets[ activeDatasetIndex ].pointStyle }
									options={ [
										{ label: 'Circle', value: 'circle' },
										{ label: 'Rectangle', value: 'rect' },
										{ label: 'Rounded Rectangle', value: 'rectRounded' },
										{ label: 'Diamond', value: 'rectRot' },
										{ label: 'Triangle', value: 'triangle' },
									] }
									onChange={ ( style ) => updateDatasetPointStyle( style, activeDatasetIndex ) }
								/>
							) }
							{ parsedData.datasets[ activeDatasetIndex ].showLine && (
								<BaseControl
									label="Color"
									id={ `inspect-chart-line-border-color-${ clientId }` }
								>
									<ColorPalette
										value={ parsedData.datasets[ activeDatasetIndex ].borderColor }
										clearable={ false }
										onChange={ ( color ) => updateDatasetColor( color, activeDatasetIndex ) }
									/>
								</BaseControl>
							) }
						</CardBody>
					) }
				</Card>
				<Flex>
					<FlexItem>
						<Button
							disabled={ 0 === activeDatasetIndex }
							isSmal={ true }
							icon="arrow-left-alt2"
							label="Previous Dataset"
							onClick={ decrementActiveDataset }
						/>
					</FlexItem>
					<FlexItem>
						<span>
							{ activeDatasetIndex + 1 } /{ ' ' }
							{ parsedData.datasets.length }
						</span>
					</FlexItem>
					<FlexItem>
						<Button
							disabled={ activeDatasetIndex === parsedData.datasets.length - 1 }
							isSmall={ true }
							icon="arrow-right-alt2"
							label="Next Dataset"
							onClick={ incrementActiveDataset }
						/>
					</FlexItem>
				</Flex>
			</PanelBody>
		);
	}
}
