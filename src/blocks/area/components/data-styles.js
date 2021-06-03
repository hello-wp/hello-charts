/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
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
 * Internal dependencies.
 */
import { hex2rgba } from '../../../common/helpers';

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
						<SelectControl
							label={ __( 'Point Style', 'hello-charts' ) }
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
						<BaseControl
							label={ __( 'Color', 'hello-charts' ) }
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
