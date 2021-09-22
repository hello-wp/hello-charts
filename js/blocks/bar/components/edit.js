/**
 * WordPress dependencies.
 */
const { createRef, Component } = wp.element;

/**
 * Internal dependencies.
 */
import { Bar } from 'react-chartjs-2';
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
				chartType="bar"
				hasAxis={ true }
				supports={ {
					backgroundColor: true,
					indexAxis: true,
					stacked: true,
					xGridDisplay: true,
					yGridDisplay: true,
					scale: 'y',
				} }
				generateData={ () => {
					return randomValues( 8 );
				} }
			>
				<Bar
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
