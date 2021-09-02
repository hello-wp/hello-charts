/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Internal dependencies.
 */
import { AxisStyles } from '.';
import { Bar } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { legend, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
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
				AxisStyles={ AxisStyles }
				chartType="bar"
				supports={ {
					backgroundColor: true,
					indexAxis: true,
					stacked: true,
				} }
				generateData={ () => {
					return randomValues( 8 );
				} }
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
