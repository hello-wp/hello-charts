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

		function updateDatasetColor( color, dataset, row ) {
			const data = JSON.parse( chartData );
			data.datasets[ dataset ].borderColor[ row ] = color;
			data.datasets[ dataset ].backgroundColor[ row ] = color;
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
						{ parsedData.datasets[ this.state.activeDataset ].borderColor && (
							<>
								{ parsedData.labels.map( ( label, row ) => (
									<BaseControl
										key={ row }
										label={ label + ' Color' }
										id={ `inspect-chart-pie-border-color-${ clientId }-${ row }` }
									>
										<ColorPalette
											value={ parsedData.datasets[ this.state.activeDataset ].borderColor[ row ] }
											clearable={ false }
											onChange={ ( color ) => updateDatasetColor( color, this.state.activeDataset, row ) }
										/>
									</BaseControl>
								) ) }
							</>
						) }
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
