/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	PanelBody,
	BaseControl,
	RangeControl,
	SelectControl,
	ToggleControl,
	ColorPalette,
	ColorIndicator,
} = wp.components;

export default class ChartStyles extends Component {
	render() {
		const {
			attributes: {
				backgroundColor,
				chartData,
				chartOptions,
			},
			supports,
			setAttributes,
		} = this.props;

		const parsedData = JSON.parse( chartData );
		const parsedOptions = JSON.parse( chartOptions );

		function updateIndexAxis( axis ) {
			const options = JSON.parse( chartOptions );
			options.indexAxis = axis;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateStacked( state ) {
			const options = JSON.parse( chartOptions );
			options.scales.x.stacked = state;
			options.scales.y.stacked = state;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateTension( property, tension ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ][ property ] = tension;
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateCutout( cutout ) {
			const data = JSON.parse( chartData );
			data.datasets.forEach( ( dataset, index ) => {
				data.datasets[ index ].cutout = cutout + '%';
			} );
			setAttributes( { chartData: JSON.stringify( data ) } );
		}

		function updateOffset( offset ) {
			const options = JSON.parse( chartOptions );
			options.elements.arc.offset = offset;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		function updateHoverOffset( hoverOffset ) {
			const options = JSON.parse( chartOptions );
			if ( 0 === hoverOffset ) {
				delete options.elements.arc.hoverOffset;
			} else {
				options.elements.arc.hoverOffset = hoverOffset;
			}
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		return (
			<PanelBody
				title={ __( 'Chart Styles', 'hello-charts' ) }
				initialOpen={ true }
				className={ 'hello-charts-chart-styles' }
			>
				{ supports.indexAxis && (
					<SelectControl
						label={ __( 'Bar Direction', 'hello-charts' ) }
						value={ parsedOptions.indexAxis }
						onChange={ ( axis ) => updateIndexAxis( axis ) }
						options={ [
							{ label: __( 'Vertical', 'hello-charts' ), value: 'x' },
							{ label: __( 'Horizontal', 'hello-charts' ), value: 'y' },
						] }
					/>
				) }
				{ supports.stacked && (
					<ToggleControl
						label={ __( 'Stack Data Sets', 'hello-charts' ) }
						checked={ parsedOptions.scales.y.stacked }
						onChange={ ( state ) => updateStacked( state ) }
					/>
				) }
				{ supports.tension && (
					<RangeControl
						label={ __( 'Curve', 'hello-charts' ) }
						value={ parsedData.datasets[ 0 ][ supports.tension ] * 20 }
						onChange={ ( tension ) => updateTension( supports.tension, tension / 20 ) }
						min={ 0 }
						max={ 10 }
					/>
				) }
				{ supports.cutout && (
					<RangeControl
						label={ __( 'Cutout', 'hello-charts' ) }
						value={ parseInt( parsedData.datasets[ 0 ].cutout ) }
						onChange={ ( cutout ) => updateCutout( cutout ) }
						min={ 0 }
						max={ 90 }
						step={ 10 }
					/>
				) }
				{ supports.offset && (
					<RangeControl
						label={ __( 'Segment Offset', 'hello-charts' ) }
						value={ parsedOptions.elements.arc.offset }
						onChange={ ( offset ) => updateOffset( offset ) }
						min={ 0 }
						max={ 30 }
						step={ 1 }
					/>
				) }
				{ supports.hoverOffset && (
					<RangeControl
						label={ __( 'Segment Hover Offset', 'hello-charts' ) }
						value={ parsedOptions.elements.arc.hoverOffset ?? 0 }
						onChange={ ( hoverOffset ) => updateHoverOffset( hoverOffset ) }
						min={ 0 }
						max={ 50 }
						step={ 1 }
					/>
				) }
				{ supports.backgroundColor && (
					<BaseControl
						id="chart-background-color"
						label={ __( 'Background Color', 'hello-charts' ) }
					>
						{ backgroundColor && (
							<ColorIndicator colorValue={ backgroundColor } aria-label={ backgroundColor } />
						) }
						<ColorPalette
							id="chart-background-color"
							colors={ wp.data.select( 'core/block-editor' ).getSettings().colors }
							value={ backgroundColor }
							onChange={ ( color ) => setAttributes( { backgroundColor: color } ) }
							clearable
						/>
					</BaseControl>
				) }
			</PanelBody>
		);
	}
}
