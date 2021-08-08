/**
 * External components.
 */
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Internal dependencies.
 */
import { ChartStyles } from '.';
import { Bar } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { randomColors, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	onNewDataset( dataset ) {
		const color = tinycolor( randomColors( 1 ).shift() );
		color.setAlpha( 0.8 );
		dataset.borderColor = color.toHexString();
		dataset.backgroundColor = color.toRgbString();
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
				chartType="bar"
				generateData={ () => { return randomValues( 8 ) } }
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
