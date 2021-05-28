/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Components and dependencies.
 */
import { ChartStyles, DataStyles } from '.';
import { Bar } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { randomColors, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	maybeGenerateData( datasets ) {
		const themeColors = randomColors( datasets.length );

		datasets.forEach( ( dataset, index ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = randomValues( 8 );
			}

			if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
				dataset.backgroundColor = themeColors[ index ];
			}
		} );
	}

	onNewDataset( dataset ) {
		const color = randomColors( 1 ).shift();

		dataset.label = __( 'New Data Set', 'hello-charts' );
		dataset.backgroundColor = color;
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
				chartType="bar"
				maybeGenerateData={ this.maybeGenerateData }
				onNewDataset={ this.onNewDataset }
				titlePlaceholder={ __( 'Bar Chart', 'hello-charts' ) }
			>
				<Bar
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
