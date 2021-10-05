/**
 * WordPress dependencies.
 */
const { createRef, Component } = wp.element;

/**
 * Internal dependencies.
 */
import { Line } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { legend, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	constructor( props ) {
		super( props );
		this.chartRef = createRef();
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
				defaultAlpha={ 0 }
				chartType="line"
				supports={ {
					backgroundColor: true,
					tension: 'lineTension',
					stacked: true,
					xGridDisplay: true,
					yGridDisplay: true,
					scale: 'y',
				} }
				generateData={ () => {
					return randomValues( 6 );
				} }
			>
				<Line
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
