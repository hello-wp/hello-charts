/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * Internal dependencies.
 */
import { ChartStyles } from '.';
import { Pie } from 'react-chartjs-2';
import { ChartBlock } from '../../../common/components';
import { randomValues } from '../../../common/helpers';

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

		return (
			<ChartBlock
				{ ...this.props }
				ChartStyles={ ChartStyles }
				hasSegments={ true }
				chartType="pie"
				generateData={ () => {
					return randomValues( 4, 1, 10 );
				} }
				titlePlaceholder={ __( 'Pie Chart', 'hello-charts' ) }
			>
				<Pie
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
