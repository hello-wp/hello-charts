/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	ToolbarButton,
	ToolbarGroup,
} = wp.components;

/**
 * Internal dependencies.
 */
import { icons } from '../../common/helpers';

export default class ChartFormattingToolbar extends Component {
	render() {
		const {
			attributes: { showChartTitle, showChartBackground, chartOptions },
			setAttributes,
		} = this.props;

		const parsedOptions = JSON.parse( chartOptions );

		function toggleShowLegend() {
			const options = JSON.parse( chartOptions );
			options.plugins.legend.display = options.plugins.legend.display ? false : true;
			setAttributes( { chartOptions: JSON.stringify( options ) } );
		}

		return (
			<ToolbarGroup className="chart-formatting-toolbar" label={ __( 'Chart Formatting', 'hello-charts' ) }>
				<ToolbarButton
					icon={ showChartTitle ? icons.chartTitleOn : icons.chartTitleOff }
					label={ showChartTitle ? __( 'Hide Chart Title', 'hello-charts' ) : __( 'Show Chart Title', 'hello-charts' ) }
					onClick={
						() => setAttributes( { showChartTitle: showChartTitle ? false : true } )
					}
				/>
				<ToolbarButton
					icon={ parsedOptions.plugins.legend.display ? icons.legendOn : icons.legendOff }
					label={ parsedOptions.plugins.legend.display ? __( 'Hide Legend', 'hello-charts' ) : __( 'Show Legend', 'hello-charts' ) }
					onClick={ toggleShowLegend }
				/>
				<ToolbarButton
					icon={ showChartBackground ? icons.chartBackgroundOn : icons.chartBackgroundOff }
					label={ showChartBackground ? __( 'Hide Chart Background', 'hello-charts' ) : __( 'Show Chart Background', 'hello-charts' ) }
					onClick={
						() => setAttributes( { showChartBackground: showChartBackground ? false : true } )
					}
				/>
			</ToolbarGroup>
		);
	}
}
