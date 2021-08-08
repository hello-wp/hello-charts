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
import { Radar } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { randomColors, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	onNewDataset( dataset ) {
		const color = tinycolor( randomColors( 1 ).shift() );
		color.setAlpha( 0.6 );
		dataset.borderColor = color.toHexString();
		dataset.pointBackgroundColor = color.toHexString();
		dataset.backgroundColor = color.toRgbString();
	}

	/**
	 * Workaround for minimumFractionDigits value is out of range bug.
	 *
	 * @see https://github.com/chartjs/Chart.js/issues/8092
	 * @param { number } value The tick value.
	 * @return { number } The unchanged value.
	 */
	ticksCallback( value ) {
		return value;
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

		parsedOptions.scales.r.ticks.callback = this.ticksCallback;

		return (
			<ChartBlock
				{ ...this.props }
				ChartStyles={ ChartStyles }
				hasPoints={ true }
				chartType="radar"
				generateData={ () => { return randomValues( 7 ) } }
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
