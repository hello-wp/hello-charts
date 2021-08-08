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
import { hex2rgba, randomColors, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	maybeGenerateData( datasets ) {
		const colors = randomColors( datasets.length );

		datasets.forEach( ( dataset, index ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = randomValues( 7 );
			}

			if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
				const color = tinycolor( colors[ index ] );
				color.setAlpha( 0.6 );
				dataset.backgroundColor = color.toRgbString();
			}

			if ( ! dataset.hasOwnProperty( 'borderColor' ) ) {
				const color = tinycolor( dataset.backgroundColor );
				dataset.borderColor = color.toHexString();
			}

			if ( ! dataset.hasOwnProperty( 'pointBackgroundColor' ) ) {
				dataset.pointBackgroundColor = dataset.borderColor;
			}

			if ( ! dataset.hasOwnProperty( 'borderWidth' ) ) {
				dataset.borderWidth = new Array( dataset.data.length ).fill( 2 );
			}

			if ( ! dataset.hasOwnProperty( 'borderAlign' ) ) {
				dataset.borderAlign = new Array( dataset.data.length ).fill( 'inner' );
			}
		} );
	}

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
				maybeGenerateData={ this.maybeGenerateData }
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
