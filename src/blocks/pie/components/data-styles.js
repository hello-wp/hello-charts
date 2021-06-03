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
import { randomColors } from '../../../common/helpers';

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

		function updateSegmentColor( color, dataset, row ) {
			const data = JSON.parse( chartData );
			data.datasets[ dataset ].borderColor[ row ] = color;
			data.datasets[ dataset ].backgroundColor[ row ] = color;
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function getColor( dataset, row ) {
			const data = JSON.parse( chartData );

			// If there's no colors at all, return null. We're not properly intialized.
			if ( ! data.datasets[ dataset ].borderColor ) {
				return;
			}

			// If there is no set color, pick one at random.
			if ( ! data.datasets[ dataset ].borderColor[ row ] ) {
				const color = randomColors( 1 ).shift();
				data.datasets[ dataset ].borderColor[ row ] = color;
				data.datasets[ dataset ].backgroundColor[ row ] = color;
				setAttributes( { chartData: JSON.stringify( data ) } );
			}

			return parsedData.datasets[ dataset ].borderColor[ row ];
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
						{ parsedData.labels.map( ( label, row ) => (
							<CustomColorPalette
								key={ row }
								label={ __( 'Color', 'hello-charts' ) }
								id={ `inspect-chart-pie-color-${ clientId }` }
								colorValue={ getColor( this.state.activeDataset, row ) }
								onChange={ ( color ) => updateSegmentColor( color, this.state.activeDataset, row ) }
							/>
						) ) }
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
