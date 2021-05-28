/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Components and dependencies.
 */
import { ChartStyles, DataStyles } from '.';
import { Radar } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { hex2rgba, randomColors, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	maybeGenerateData( datasets ) {
		const themeColors = randomColors( datasets.length );

		datasets.forEach( ( dataset, index ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = randomValues( 7 );
			}

			if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
				dataset.borderColor = themeColors[ index ];
				dataset.pointBackgroundColor = themeColors[ index ];
				dataset.backgroundColor = hex2rgba( themeColors[ index ], 0.6 );
			}
		} );
	}

	onNewDataset( dataset ) {
		const color = randomColors( 1 ).shift();

		dataset.label = __( 'New Data Set' );
		dataset.borderColor = color;
		dataset.pointBackgroundColor = color;
		dataset.backgroundColor = hex2rgba( color, 0.6 );
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
				chartType="radar"
				maybeGenerateData={ this.maybeGenerateData }
				onNewDataset={ this.onNewDataset }
				titlePlaceholder={ __( 'Radar Chart', 'hello-charts' ) }
			>
				<Radar
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