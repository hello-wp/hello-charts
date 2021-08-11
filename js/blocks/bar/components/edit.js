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
				chartType="bar"
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
