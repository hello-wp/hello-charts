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
import { Pie } from 'react-chartjs-2';
import { ChartBlock, DataStyles, SegmentStyles } from '../../../common/components';
import { randomColors, randomValues } from '../../../common/helpers';

export default class Edit extends Component {
	maybeGenerateData( datasets ) {
		datasets.forEach( ( dataset ) => {
			if ( 'generate' === dataset.data[ 0 ] ) {
				dataset.data = randomValues( 4, 1, 10 );
			}

			if ( ! dataset.hasOwnProperty( 'backgroundColor' ) ) {
				const colors = randomColors( dataset.data.length );
				dataset.backgroundColor = [];
				dataset.data.forEach( ( data, index ) => {
					const color = tinycolor( colors[ index ] );
					color.setAlpha( 0.8 );
					dataset.backgroundColor.push( color.toRgbString() );
				} );
			}

			if ( ! dataset.hasOwnProperty( 'borderColor' ) ) {
				dataset.borderColor = [];
				dataset.data.forEach( ( data, index ) => {
					const color = tinycolor( dataset.backgroundColor[ index ] );
					dataset.borderColor.push( color.toHexString() );
				} );
			}

			if ( ! dataset.hasOwnProperty( 'borderWidth' ) ) {
				dataset.borderWidth = new Array( dataset.data.length ).fill( 2 );
			}

			if ( ! dataset.hasOwnProperty( 'borderAlign' ) ) {
				dataset.borderAlign = new Array( dataset.data.length ).fill( 'inner' );
			}
		} );
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
				DataStyles={ DataStyles }
				SegmentStyles={ SegmentStyles }
				chartType="pie"
				maybeGenerateData={ this.maybeGenerateData }
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
