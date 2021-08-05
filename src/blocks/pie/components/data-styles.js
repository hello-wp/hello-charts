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
} = wp.components;

/**
 * Internal dependencies.
 */
export default class DataStyles extends Component {
	constructor( props ) {
		super( props );

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

	render() {
		const {
			attributes: { chartData },
			clientId,
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
			</PanelBody>
		);
	}
}
