/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Internal dependencies.
 */
import { ChartStyles, DataStyles } from '.';
import { PolarArea } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { hex2rgba, randomColors, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	maybeGenerateData( datasets ) {
		datasets.forEach( ( dataset ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = randomValues( 5, 3, 10 );
			}

			if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
				const themeColors = randomColors( dataset.data.length );
				dataset.borderColor = [];
				dataset.backgroundColor = [];
				dataset.data.forEach( ( data, index ) => {
					dataset.borderColor.push( themeColors[ index ] );
					dataset.backgroundColor.push( hex2rgba( themeColors[ index ], 0.6 ) );
				} );
			}
		} );
	}

	onNewDataset( dataset ) {
		const colors = randomColors( dataset.data.length );
		dataset.borderColor = colors;
		dataset.backgroundColor = colors;
	}

	render() {
		const {
			attributes: {
				blockId,
				chartData,
				chartOptions,
				height,
				width,
			},
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		return (
			<ChartBlock
				{ ...this.props }
				ChartStyles={ ChartStyles }
				DataStyles={ DataStyles }
				chartType="polarArea"
				maybeGenerateData={ this.maybeGenerateData }
				onNewDataset={ this.onNewDataset }
				titlePlaceholder={ __( 'Polar Area Chart', 'hello-charts' ) }
			>
				<PolarArea
					height={ height }
					width={ width }
					id={ blockId }
					data={ parsedData }
					options={ parsedOptions }
				/>
			</ChartBlock>
		);
	}
}
