/**
 * External components.
 */
import { get, set } from 'lodash';

/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	ToggleControl,
	TextControl,
	BaseControl,
} = wp.components;

export default class AxisStyles extends Component {
	render() {
		const {
			attributes: {
				autoScale,
				chartOptions,
			},
			chartRef,
			setAttributes,
			supports,
		} = this.props;

		function getMaxValue( axis ) {
			return chartRef.current.scales[ axis ].max;
		}

		function getMinValue( axis ) {
			return chartRef.current.scales[ axis ].min;
		}

		function getStepSize( axis ) {
			const firstTick = chartRef.current.scales[ axis ].ticks[ 0 ].value;
			const secondTick = chartRef.current.scales[ axis ].ticks[ 1 ].value;
			return secondTick - firstTick;
		}

		function updateAutoScale( state, axis ) {
			const options = JSON.parse( chartOptions );
			const scale = supports.scale;

			if ( ! state ) {
				set( options.scales, `${ axis }.min`, getMinValue( scale ) );
				set( options.scales, `${ axis }.max`, getMaxValue( scale ) );
				set( options.scales, `${ axis }.ticks.stepSize`, getStepSize( scale ) );
			} else {
				delete options.scales[ axis ].min;
				delete options.scales[ axis ].max;
				delete options.scales[ axis ].ticks.stepSize;
			}

			setAttributes( {
				autoScale: state,
				chartOptions: JSON.stringify( options ),
			} );
		}

		function updateMinMax( state, axis, property ) {
			const options = JSON.parse( chartOptions );

			if ( 'min' === property && state < options.scales[ axis ].max ) {
				options.scales[ axis ].min = Math.floor( state );
			}

			if ( 'max' === property && state > options.scales[ axis ].min ) {
				options.scales[ axis ].max = Math.round( state );
			}

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStepSize( stepSize, axis ) {
			const options = JSON.parse( chartOptions );

			options.scales[ axis ].ticks.stepSize = stepSize;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateShowAxisProperty( state, axis, property ) {
			const options = JSON.parse( chartOptions );

			options.scales[ axis ][ property ].display = state;

			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		const parsedOptions = JSON.parse( chartOptions );

		return (
			<PanelBody title={ __( 'Axis Styles', 'hello-charts' ) } initialOpen={ false }>
				{ supports.angleLines && (
					<ToggleControl
						label={ __( 'Show Angle Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.angleLines.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'angleLines' ) }
					/>
				) }
				{ supports.xGridDisplay && (
					<ToggleControl
						label={ __( 'Show X Axis Grid Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.x.grid.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'x', 'grid' ) }
					/>
				) }
				{ supports.yGridDisplay && (
					<ToggleControl
						label={ __( 'Show Y Axis Grid Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.y.grid.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'y', 'grid' ) }
					/>
				) }
				{ supports.rGridDisplay && (
					<ToggleControl
						label={ __( 'Show Grid Lines', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.grid.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'grid' ) }
					/>
				) }
				{ supports.ticks && (
					<ToggleControl
						label={ __( 'Show Scale Labels', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.ticks.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'ticks' ) }
					/>
				) }
				{ supports.pointLabels && (
					<ToggleControl
						label={ __( 'Show Point Labels', 'hello-charts' ) }
						checked={
							parsedOptions.scales.r.pointLabels.display
						}
						onChange={ ( state ) => updateShowAxisProperty( state, 'r', 'pointLabels' ) }
					/>
				) }
				{ supports.scale && (
					<ToggleControl
						label={ __( 'Auto Scale', 'hello-charts' ) }
						checked={ autoScale }
						onChange={ ( state ) => updateAutoScale( state, supports.scale ) }
					/>
				) }
				{ supports.scale && ! autoScale && (
					<BaseControl className="chart-manual-scale" >
						<TextControl
							type="number"
							className="chart-manual-scale-control"
							label={ __( 'Min', 'hello-charts' ) }
							value={ get( parsedOptions.scales, `${ supports.scale }.min` ) }
							onChange={ ( state ) => updateMinMax( state, supports.scale, 'min' ) }
						/>
						<TextControl
							type="number"
							className="chart-manual-scale-control"
							label={ __( 'Max', 'hello-charts' ) }
							value={ get( parsedOptions.scales, `${ supports.scale }.max` ) }
							onChange={ ( state ) => updateMinMax( state, supports.scale, 'max' ) }
						/>
						<TextControl
							type="number"
							className="chart-manual-scale-control"
							label={ __( 'Step Size', 'hello-charts' ) }
							value={ get( parsedOptions.scales, `${ supports.scale }.ticks.stepSize` ) }
							min={ 1 }
							onChange={ ( stepSize ) => updateStepSize( stepSize, supports.scale ) }
						/>
					</BaseControl>
				) }
			</PanelBody>
		);
	}
}
