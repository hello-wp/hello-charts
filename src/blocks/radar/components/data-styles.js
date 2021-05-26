/**
 * Components and dependencies.
 */
import { hex2rgba } from '../../../common/helpers';

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

export default class DataStyles extends Component {
	constructor( props ) {
		super( props );

		this.state = { activeDataset: 0 };
	}

	render() {
		const {
			attributes: { chartData },
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

		return (
			<PanelBody title="Data Styles" initialOpen={ false }>
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
							label="Point Style"
							value={ parsedData.datasets[ this.state.activeDataset ].pointStyle }
							options={ [
								{ label: 'Circle', value: 'circle' },
								{ label: 'Rectangle', value: 'rect' },
								{ label: 'Rounded Rectangle', value: 'rectRounded' },
								{ label: 'Diamond', value: 'rectRot' },
								{ label: 'Triangle', value: 'triangle' },
							] }
							onChange={ ( style ) => updateDatasetPointStyle( style, this.state.activeDataset ) }
						/>
						<BaseControl
							label="Color"
							id={ `inspect-chart-line-border-color-${ clientId }` }
						>
							<ColorPalette
								value={ parsedData.datasets[ this.state.activeDataset ].borderColor }
								clearable={ false }
								onChange={ ( color ) => updateDatasetColor( color, this.state.activeDataset ) }
							/>
						</BaseControl>
					</CardBody>
				</Card>
				<Flex>
					<FlexItem>
						<Button
							disabled={ 0 === this.state.activeDataset }
							isSmal={ true }
							icon="arrow-left-alt2"
							label="Previous Dataset"
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
							label="Next Dataset"
							onClick={ () => this.setState( { activeDataset: this.state.activeDataset + 1 } ) }
						/>
					</FlexItem>
				</Flex>
			</PanelBody>
		);
	}
}
