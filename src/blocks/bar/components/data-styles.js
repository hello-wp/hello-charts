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
} = wp.components;

/**
 * Internal dependencies.
 */
import { CustomColorPalette } from '../../../common/components';

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
			data.datasets[ index ].backgroundColor = color;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		return (
			<PanelBody title={ __( 'Data Styles', 'hello-charts' ) } initialOpen={ false }>
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
						<CustomColorPalette
							label={ __( 'Color', 'hello-charts' ) }
							id={ `inspect-chart-bar-color-${ clientId }` }
							colorValue={ parsedData.datasets[ this.state.activeDataset ].backgroundColor }
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
