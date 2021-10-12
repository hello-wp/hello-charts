/**
 * WordPress dependencies.
 */
const { createRef, Component } = wp.element;

/**
 * Internal dependencies.
 */
import { Radar } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { legend, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	constructor( props ) {
		super( props );
		this.chartRef = createRef();
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

		parsedOptions.scales.r = {
			...parsedOptions.scales.r,
			callback: this.ticksCallback,
		};
		parsedOptions.plugins.legend = {
			...parsedOptions.plugins.legend,
			labels: legend.labels,
		};

		return (
			<ChartBlock
				{ ...this.props }
				chartRef={ this.chartRef }
				hasAxis={ true }
				hasPoints={ true }
				hasBorderStyle={ true }
				chartType="radar"
				supports={ {
					backgroundColor: true,
					tension: 'tension',
					angleLines: true,
					rGridDisplay: true,
					ticks: true,
					pointLabels: true,
					scale: 'r',
					axisColor: true,
				} }
				generateData={ () => {
					return randomValues( 7 );
				} }
			>
				<Radar
					height={ height }
					width={ width }
					id={ blockId }
					data={ parsedData }
					options={ parsedOptions }
					ref={ this.chartRef }
				/>
			</ChartBlock>
		);
	}
}
