/**
 * WordPress dependencies.
 */
const { createRef, Component } = wp.element;

/**
 * Internal dependencies.
 */
import { Pie } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { legend, randomValues, tooltip } from '../../../common/helpers';

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
			labels: legend.segmentLabels,
			onClick: legend.segmentClick,
		};
		parsedOptions.plugins.tooltip = {
			...parsedOptions.plugins.tooltip,
			callbacks: tooltip.segmentCallbacks,
		};

		return (
			<ChartBlock
				{ ...this.props }
				chartRef={ this.chartRef }
				hasSegments={ true }
				chartType="pie"
				supports={ {
					backgroundColor: true,
					cutout: true,
				} }
				generateData={ () => {
					return randomValues( 4, 1, 10 );
				} }
			>
				<Pie
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
